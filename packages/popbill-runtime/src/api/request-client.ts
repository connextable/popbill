import { fetchJson } from '@/transport/fetch-json'
import type { TokenProvider } from '@/auth'
import { PopbillHttpMethodOverrides } from '@/spec-constants'
import { isBlank, normalizeOptionalString, sha1Base64, trimTrailingSlash } from '@connextable/popbill-utils'
import type * as Spec from '@connextable/popbill-spec'

const POPBILL_USER_AGENT = 'NODEJS POPBILL SDK'

export type PopbillRequestStage = 'issue_token' | 'request_api'

export interface PopbillRequestStageError {
  requestStage: PopbillRequestStage
  cause: unknown
}

export interface PopbillRequestClientConfig {
  apiBaseUrl: string
  timeoutMs: number
  tokenProvider: TokenProvider
  acceptEncoding?: Spec.PopbillAcceptEncoding | null
  acceptLanguage?: Spec.PopbillAcceptLanguage
}

export interface PopbillRequestOptions {
  uri: string
  corpNum?: string
  userId?: string
  method?: string
  body?: BodyInit | null
  contentType?: string | null
  submitId?: string
  headers?: Record<string, string>
}

export interface PopbillRequestClient {
  requestJson<T>(options: PopbillRequestOptions): Promise<T>
}

export function createPopbillRequestClient(config: PopbillRequestClientConfig): PopbillRequestClient {
  const normalizedApiBaseUrl = trimTrailingSlash(config.apiBaseUrl)
  const normalizedAcceptLanguage = normalizeOptionalString(config.acceptLanguage)

  return {
    async requestJson<T>(options: PopbillRequestOptions): Promise<T> {
      const method = (options.method ?? 'GET').toUpperCase()
      const requestHeaders: Record<string, string> = {
        ...options.headers,
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
          const messageSource = typeof options.body === 'string' ? options.body : ''
          requestHeaders['X-PB-MESSAGE-DIGEST'] = sha1Base64(messageSource)
          if (isNonBlankString(options.submitId)) {
            requestHeaders['X-PB-SUBMIT-ID'] = options.submitId
          }
        }
      }

      if (isNonBlankString(options.corpNum)) {
        try {
          const token = await config.tokenProvider.getToken(options.corpNum)
          requestHeaders['Authorization'] = `Bearer ${token.sessionToken}`
        } catch (error) {
          throw createStageError('issue_token', error)
        }
      }

      try {
        return await fetchJson<T>(
          `${normalizedApiBaseUrl}${options.uri}`,
          {
            method: method === 'GET' ? 'GET' : 'POST',
            headers: requestHeaders,
            body: method === 'GET' ? undefined : (options.body ?? undefined),
          },
          { timeoutMs: config.timeoutMs }
        )
      } catch (error) {
        throw createStageError('request_api', error)
      }
    },
  }
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
