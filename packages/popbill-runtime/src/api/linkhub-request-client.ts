import { fetchJson } from '@/transport/fetch-json'
import type { TokenProvider } from '@/auth'
import { normalizeOptionalString, trimTrailingSlash } from '@connextable/popbill-utils'

const LINKHUB_USER_AGENT = 'NODEJS LINKHUB SDK'

export type LinkhubRequestStage = 'issue_token' | 'request_api'

export interface LinkhubRequestStageError {
  requestStage: LinkhubRequestStage
  cause: unknown
}

export interface LinkhubRequestClientConfig {
  apiBaseUrl: string
  timeoutMs: number
  tokenProvider: TokenProvider
  tokenCacheKey: string
  userAgent?: string
  acceptEncoding?: string | null
  acceptLanguage?: string
}

export interface LinkhubRequestOptions {
  uri: string
  method?: string
  body?: BodyInit | null
  contentType?: string | null
  headers?: Record<string, string>
}

export interface LinkhubRequestClient {
  requestJson<T>(options: LinkhubRequestOptions): Promise<T>
}

export function createLinkhubRequestClient(config: LinkhubRequestClientConfig): LinkhubRequestClient {
  const normalizedApiBaseUrl = trimTrailingSlash(config.apiBaseUrl)
  const normalizedAcceptLanguage = normalizeOptionalString(config.acceptLanguage)
  const normalizedUserAgent = normalizeOptionalString(config.userAgent) ?? LINKHUB_USER_AGENT

  return {
    async requestJson<T>(options: LinkhubRequestOptions): Promise<T> {
      const method = (options.method ?? 'GET').toUpperCase()
      const requestHeaders: Record<string, string> = {
        ...options.headers,
        'User-Agent': normalizedUserAgent,
      }

      if (options.contentType !== null) {
        if (typeof options.contentType === 'string') {
          requestHeaders['Content-Type'] = options.contentType
        } else if (!isFormDataBody(options.body) && method !== 'GET') {
          requestHeaders['Content-Type'] = 'application/json;charset=utf-8'
        }
      }

      if (config.acceptEncoding !== null) {
        requestHeaders['Accept-Encoding'] = config.acceptEncoding === undefined ? 'gzip' : config.acceptEncoding
      }

      if (normalizedAcceptLanguage) {
        requestHeaders['Accept-Language'] = normalizedAcceptLanguage
      }

      try {
        const token = await config.tokenProvider.getToken(config.tokenCacheKey)
        requestHeaders['Authorization'] = `Bearer ${token.sessionToken}`
      } catch (error) {
        throw createLinkhubStageError('issue_token', error)
      }

      try {
        return await fetchJson<T>(
          `${normalizedApiBaseUrl}${options.uri}`,
          {
            method,
            headers: requestHeaders,
            body: method === 'GET' ? undefined : (options.body ?? undefined),
          },
          { timeoutMs: config.timeoutMs }
        )
      } catch (error) {
        throw createLinkhubStageError('request_api', error)
      }
    },
  }
}

function isFormDataBody(body: LinkhubRequestOptions['body']): body is FormData {
  return typeof FormData !== 'undefined' && body instanceof FormData
}

export function isLinkhubRequestStageError(error: unknown): error is LinkhubRequestStageError {
  if (typeof error !== 'object' || error === null) {
    return false
  }

  if (!('requestStage' in error) || !('cause' in error)) {
    return false
  }

  const stage = (error as { requestStage: unknown }).requestStage
  return stage === 'issue_token' || stage === 'request_api'
}

function createLinkhubStageError(stage: LinkhubRequestStage, cause: unknown): LinkhubRequestStageError & Error {
  return Object.assign(new Error(`Linkhub request failed at stage "${stage}".`), {
    requestStage: stage,
    cause,
  })
}
