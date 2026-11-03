import { constantTimeEqual, isRecord, normalizeRequiredString } from '@connextable/popbill-utils'
import type { PopbillWebhookBatchHeader } from '@connextable/popbill-spec/webhook'

/** Webhook credentials configured in Popbill, independent of the API secret key. */
export type PopbillWebhookAuthentication =
  | { type: 'apiKey'; apiKey: string }
  | { type: 'basic'; username: string; password: string }
  | { type: 'none' }

export interface PopbillWebhookReceiverConfig {
  authentication: PopbillWebhookAuthentication
}

export interface PopbillWebhookInput {
  headers: Headers | Readonly<Record<string, string | readonly string[] | undefined>>
  /** Raw JSON, UTF-8 bytes, or an already parsed JSON object/array. */
  body: unknown
}

export type PopbillWebhookErrorCode = 'INVALID_CONFIGURATION' | 'AUTHENTICATION_FAILED' | 'INVALID_HEADERS' | 'INVALID_PAYLOAD'

/** Contains no credentials or request body. Applications choose their HTTP error response. */
export class PopbillWebhookError extends Error {
  override readonly name = 'PopbillWebhookError'

  constructor(
    readonly code: PopbillWebhookErrorCode,
    message: string
  ) {
    super(message)
  }
}

export interface PopbillWebhookSuccessResponse {
  status: 200
  headers: { 'content-type': 'application/json; charset=utf-8' }
  body: '{"result":"OK"}'
}

export interface ParsedPopbillWebhookItem {
  webhookType: string
  businessNumber: string
  body: Record<string, unknown>
  /** Zero-based index in the delivery, including single-object deliveries. */
  index: number
  batchHeader?: PopbillWebhookBatchHeader
}

export interface ParsedPopbillWebhookMessage {
  messageId: string
  businessNumber: string
  webhookType: string
  headerEventType?: string
  items: ParsedPopbillWebhookItem[]
  /** Parsed original JSON. Authentication headers are never included. */
  rawBody: Record<string, unknown> | Record<string, unknown>[]
}

/** Builds a stateless parser. No HTTP server, acknowledgement, or storage is started. */
export function createPopbillWebhookParser(config: PopbillWebhookReceiverConfig) {
  const authenticate = createAuthenticator(config)
  return {
    parse(input: PopbillWebhookInput): ParsedPopbillWebhookMessage {
      if (!isRecord(input) || !isRecord(input.headers)) {
        throw new PopbillWebhookError('INVALID_HEADERS', 'Webhook headers are required.')
      }
      authenticate(input.headers)
      const webhookType = requiredHeader(input.headers, 'pb-webhook-type')
      const businessNumber = requiredHeader(input.headers, 'pb-webhook-corpnum')
      const messageId = requiredHeader(input.headers, 'pb-webhook-mid')
      const headerEventType = readHeader(input.headers, 'pb-webhook-eventtype')
      const contentType = readHeader(input.headers, 'content-type')
      if (contentType !== undefined && !/^application\/json(?:\s*;|\s*$)/i.test(contentType)) {
        throw new PopbillWebhookError('INVALID_HEADERS', 'Webhook content type must be application/json.')
      }
      const rawBody = parseBody(input.body)
      const items = Array.isArray(rawBody)
        ? rawBody.map((item, index) => {
            if (!isRecord(item['header']) || !isRecord(item['body'])) {
              throw new PopbillWebhookError('INVALID_PAYLOAD', `Invalid webhook batch item at index ${index}.`)
            }
            const batchHeader = item['header']
            return {
              webhookType: optionalMetadata(batchHeader['TYPE']) ?? webhookType,
              businessNumber: optionalMetadata(batchHeader['CORPNUM']) ?? businessNumber,
              body: item['body'],
              index,
              batchHeader,
            }
          })
        : [{ webhookType, businessNumber, body: rawBody, index: 0 }]
      return { messageId, businessNumber, webhookType, headerEventType, items, rawBody }
    },
    createSuccessResponse(this: void): PopbillWebhookSuccessResponse {
      return { status: 200, headers: { 'content-type': 'application/json; charset=utf-8' }, body: '{"result":"OK"}' }
    },
  }
}

function readHeader(headers: PopbillWebhookInput['headers'], name: string): string | undefined {
  if (headers instanceof Headers) return headers.get(name) ?? undefined
  const matches = Object.entries(headers).filter(([key]) => key.toLowerCase() === name)
  if (matches.length > 1) throw new PopbillWebhookError('INVALID_HEADERS', 'Duplicate webhook header.')
  const value = matches[0]?.[1]
  if (value === undefined) return undefined
  if (typeof value === 'string') return value
  if (Array.isArray(value) && value.length === 1 && typeof value[0] === 'string') return value[0]
  throw new PopbillWebhookError('INVALID_HEADERS', 'Webhook headers must contain one string value.')
}

function requiredHeader(headers: PopbillWebhookInput['headers'], name: string): string {
  try {
    return normalizeRequiredString(readHeader(headers, name), 'Required webhook header is missing.')
  } catch {
    throw new PopbillWebhookError('INVALID_HEADERS', `Missing or invalid ${name} header.`)
  }
}

function optionalMetadata(value: unknown): string | undefined {
  if (value === undefined) return undefined
  if (typeof value !== 'string' || value.trim() === '') throw new PopbillWebhookError('INVALID_PAYLOAD', 'Invalid webhook item metadata.')
  return value
}

function parseBody(input: unknown): ParsedPopbillWebhookMessage['rawBody'] {
  let value: unknown = input
  try {
    if (value instanceof Uint8Array) value = new TextDecoder('utf-8', { fatal: true }).decode(value)
    if (typeof value === 'string') value = JSON.parse(value)
  } catch {
    throw new PopbillWebhookError('INVALID_PAYLOAD', 'Webhook body must contain valid UTF-8 JSON.')
  }
  if (isRecord(value)) return value
  if (Array.isArray(value) && value.every(isRecord)) return value
  throw new PopbillWebhookError('INVALID_PAYLOAD', 'Webhook body must be an object or batch of objects.')
}

function createAuthenticator(config: PopbillWebhookReceiverConfig): (headers: PopbillWebhookInput['headers']) => void {
  if (!isRecord(config) || !isRecord(config.authentication)) {
    throw new PopbillWebhookError('INVALID_CONFIGURATION', 'Explicit webhook authentication configuration is required.')
  }
  const authentication = config.authentication
  if (authentication.type === 'none') return () => {}
  let header: string
  let expected: string
  if (authentication.type === 'apiKey') {
    expected = secret(authentication.apiKey)
    header = 'x-api-key'
  } else if (authentication.type === 'basic') {
    const username = secret(authentication.username)
    if (username.includes(':')) throw new PopbillWebhookError('INVALID_CONFIGURATION', 'Basic username must not contain a colon.')
    expected = Buffer.from(`${username}:${secret(authentication.password)}`, 'utf-8').toString('base64')
    header = 'authorization'
  } else {
    throw new PopbillWebhookError('INVALID_CONFIGURATION', 'Unknown webhook authentication type.')
  }
  return (headers) => {
    const value = readHeader(headers, header)
    const candidate = header === 'authorization' ? /^Basic ([A-Za-z0-9+/]+={0,2})$/i.exec(value ?? '')?.[1] : value
    if (candidate === undefined || !constantTimeEqual(candidate, expected)) {
      throw new PopbillWebhookError('AUTHENTICATION_FAILED', 'Webhook authentication failed.')
    }
  }
}

function secret(value: unknown): string {
  if (typeof value !== 'string' || value.length === 0)
    throw new PopbillWebhookError('INVALID_CONFIGURATION', 'Webhook credentials must be nonempty strings.')
  return value
}
