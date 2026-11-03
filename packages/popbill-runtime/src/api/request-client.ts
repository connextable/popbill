import { fetchBinary, fetchJson, type FetchJsonOptions } from '@/transport/fetch-json'
import { mergeRequestHeaders } from '@/transport/merge-headers'
import { buildRequestUrl } from '@/transport/build-request-url'
import type { TokenProvider } from '@/auth'
import { PopbillHttpMethodOverrides } from '@/spec-constants'
import { isBlank, normalizeOptionalString, sha1Base64, trimTrailingSlash } from '@connextable/popbill-utils'
import type * as Spec from '@connextable/popbill-spec'
import type { RequestContext } from './request-context'
import { throwIfRequestAborted } from '../transport/errors'
import { getRequestToken } from '../auth/token-provider'

const POPBILL_USER_AGENT = 'NODEJS POPBILL SDK'

export type PopbillRequestStage = 'issue_token' | 'request_api'

export interface PopbillRequestStageError {
  requestStage: PopbillRequestStage
  cause: unknown
}

export interface PopbillRequestClientConfig {
  fetch?: typeof globalThis.fetch
  requestContext?: RequestContext
  apiBaseUrl: string
  /** Request timeout in milliseconds, up to 2_147_483_647. */
  timeoutMs: number
  tokenProvider: TokenProvider
  acceptEncoding?: Spec.PopbillAcceptEncoding | null
  acceptLanguage?: Spec.PopbillAcceptLanguage
}

export interface PopbillRequestOptions {
  signal?: AbortSignal
  /** API path and query appended to apiBaseUrl; dot path segments are not allowed. */
  uri: string
  corpNum?: string
  userId?: string
  method?: string
  body?: RequestInit['body']
  contentType?: string | null
  submitId?: string
  headers?: Record<string, string>
}

export interface PopbillRequestClient {
  requestJson<T>(options: PopbillRequestOptions): Promise<T>
  requestBinary(options: PopbillRequestOptions): Promise<Uint8Array>
  invalidateToken?(corpNum: string): void
}

export function createPopbillRequestClient(config: PopbillRequestClientConfig): PopbillRequestClient {
  const normalizedApiBaseUrl = trimTrailingSlash(config.apiBaseUrl)
  const normalizedAcceptLanguage = normalizeOptionalString(config.acceptLanguage)

  return {
    requestJson<T>(options: PopbillRequestOptions): Promise<T> {
      return request(options, fetchJson<T>)
    },
    requestBinary(options: PopbillRequestOptions): Promise<Uint8Array> {
      return request(options, fetchBinary)
    },
    invalidateToken(corpNum: string): void {
      config.tokenProvider.invalidate?.(corpNum)
    },
  }

  async function request<T>(
    options: PopbillRequestOptions,
    transport: (url: string, init: RequestInit, options: FetchJsonOptions) => Promise<T>
  ): Promise<T> {
    const signal = options.signal ?? config.requestContext?.getSignal()
    const method = (options.method ?? 'GET').toUpperCase()
    const requestHeaders: Record<string, string> = {
      'User-Agent': POPBILL_USER_AGENT,
    }

    if (options.contentType !== null) {
      if (typeof options.contentType === 'string') {
        requestHeaders['Content-Type'] = options.contentType
      } else if (!isFormDataBody(options.body)) {
        requestHeaders['Content-Type'] = 'application/json;charset=utf-8'
      }
    }

    if (config.acceptEncoding !== null) {
      requestHeaders['Accept-Encoding'] = config.acceptEncoding === undefined ? 'gzip' : config.acceptEncoding
    }

    if (normalizedAcceptLanguage) {
      requestHeaders['Accept-Language'] = normalizedAcceptLanguage
    }

    if (isNonBlankString(options.userId)) {
      requestHeaders['x-pb-userid'] = options.userId
    }

    if (method !== 'GET' && method !== 'POST') {
      requestHeaders['X-HTTP-Method-Override'] = method

      if (method === PopbillHttpMethodOverrides.BulkIssue) {
        const messageSource = getBulkIssueMessageSource(options.body)
        requestHeaders['X-PB-MESSAGE-DIGEST'] = sha1Base64(messageSource)
        if (isNonBlankString(options.submitId)) {
          requestHeaders['X-PB-SUBMIT-ID'] = options.submitId
        }
      }
    }

    try {
      throwIfRequestAborted(signal)
      if (isNonBlankString(options.corpNum)) {
        const token = await getRequestToken(config.tokenProvider, options.corpNum, signal)
        requestHeaders['Authorization'] = `Bearer ${token.sessionToken}`
      }
    } catch (error) {
      throw createStageError(isNonBlankString(options.corpNum) ? 'issue_token' : 'request_api', error)
    }

    try {
      return await transport(
        buildRequestUrl(normalizedApiBaseUrl, options.uri),
        {
          method: method === 'GET' ? 'GET' : 'POST',
          headers: mergeRequestHeaders(options.headers, requestHeaders),
          body: method === 'GET' ? undefined : (options.body ?? undefined),
          signal,
        },
        { timeoutMs: config.timeoutMs, fetch: config.fetch }
      )
    } catch (error) {
      throw createStageError('request_api', error)
    }
  }
}

function getBulkIssueMessageSource(body: PopbillRequestOptions['body']): string | Uint8Array {
  if (body === null || body === undefined || typeof body === 'string') {
    return body ?? ''
  }

  if (body instanceof ArrayBuffer) {
    return new Uint8Array(body)
  }

  if (ArrayBuffer.isView(body)) {
    return new Uint8Array(body.buffer, body.byteOffset, body.byteLength)
  }

  throw new TypeError('BULKISSUE body must be a string, ArrayBuffer, ArrayBuffer view, null, or undefined.')
}

function isFormDataBody(body: PopbillRequestOptions['body']): body is FormData {
  return typeof FormData !== 'undefined' && body instanceof FormData
}

function isNonBlankString(value: string | undefined): value is string {
  return !isBlank(value)
}

export function isPopbillRequestStageError(error: unknown): error is PopbillRequestStageError {
  if (typeof error !== 'object' || error === null) {
    return false
  }

  if (!('requestStage' in error) || !('cause' in error)) {
    return false
  }

  const stage = (error as { requestStage: unknown }).requestStage
  return stage === 'issue_token' || stage === 'request_api'
}

function createStageError(stage: PopbillRequestStage, cause: unknown): PopbillRequestStageError & Error {
  return Object.assign(new Error(`Popbill request failed at stage "${stage}".`), {
    requestStage: stage,
    cause,
  })
}
