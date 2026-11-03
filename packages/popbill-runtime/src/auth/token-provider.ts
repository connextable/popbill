import type { CachedTokenProvider, CreateTokenProviderInput, LinkhubTokenResponse, TokenProvider } from './types'
import { LinkhubServiceIds } from '@/spec-constants'
import { throwIfRequestAborted, waitForRequest } from '../transport/errors'
import type { RequestCallOptions } from '../api/request-context'

const DEFAULT_TOKEN_REFRESH_SKEW_MS = 60_000

/** Preserve legacy provider calls without options while making signal-aware waits cancellable. */
export function getRequestToken(provider: TokenProvider, key: string, signal?: AbortSignal): Promise<LinkhubTokenResponse> {
  throwIfRequestAborted(signal)
  return waitForRequest(signal ? provider.getToken(key, { signal }) : provider.getToken(key), signal)
}

interface PendingTokenRequest {
  promise: Promise<LinkhubTokenResponse>
  controller: AbortController
  waiters: number
  settled: boolean
}

export function createTokenProvider(input: CreateTokenProviderInput): CachedTokenProvider {
  const tokenCache = new Map<string, LinkhubTokenResponse>()
  const pendingRequests = new Map<string, PendingTokenRequest>()
  const refreshSkewMs = resolveRefreshSkewMs(input.refreshSkewMs)

  return {
    async getToken(businessNumber: string, options?: RequestCallOptions): Promise<LinkhubTokenResponse> {
      const signal = options?.signal ?? input.requestContext?.getSignal()
      throwIfRequestAborted(signal)
      const cachedToken = tokenCache.get(businessNumber)
      if (cachedToken && !isExpiredToken(cachedToken, refreshSkewMs)) {
        return cachedToken
      }

      let pendingRequest = pendingRequests.get(businessNumber)
      let start: (() => void) | undefined
      if (!pendingRequest) {
        const controller = new AbortController()
        let resolveToken!: (token: LinkhubTokenResponse) => void
        let rejectToken!: (error: unknown) => void
        const promise = new Promise<LinkhubTokenResponse>((resolve, reject) => {
          resolveToken = resolve
          rejectToken = reject
        })
        const entry: PendingTokenRequest = { promise, controller, waiters: 0, settled: false }
        pendingRequest = entry
        pendingRequests.set(businessNumber, entry)
        const cleanup = () => {
          entry.settled = true
          if (pendingRequests.get(businessNumber) === entry) pendingRequests.delete(businessNumber)
        }
        start = () => {
          try {
            throwIfRequestAborted(controller.signal)
            void input.authClient
              .issueToken(
                {
                  serviceId: input.serviceId,
                  accessId: input.serviceId === LinkhubServiceIds.JusoLink ? null : businessNumber,
                  scopes: input.scopes,
                  forwardedIp: input.forwardedIp,
                },
                { signal: controller.signal }
              )
              .then(
                (issuedToken) => {
                  // An invalidated request can finish after a replacement request has started.
                  if (pendingRequests.get(businessNumber) === entry && !controller.signal.aborted) {
                    tokenCache.set(businessNumber, issuedToken)
                  }
                  cleanup()
                  resolveToken(issuedToken)
                },
                (error: unknown) => {
                  cleanup()
                  rejectToken(error)
                }
              )
          } catch (error) {
            cleanup()
            rejectToken(error)
          }
        }
      }
      const entry = pendingRequest
      entry.waiters += 1
      const result = waitForRequest(entry.promise, signal, () => {
        entry.waiters -= 1
        if (entry.waiters === 0 && !entry.settled) {
          if (pendingRequests.get(businessNumber) === entry) pendingRequests.delete(businessNumber)
          entry.controller.abort(signal?.reason)
        }
      })
      start?.()
      return result
    },
    invalidate(businessNumber: string): void {
      tokenCache.delete(businessNumber)
      pendingRequests.delete(businessNumber)
    },
  }
}

function isExpiredToken(token: LinkhubTokenResponse, refreshSkewMs: number): boolean {
  const expiresAt = Date.parse(token.expiredAt)

  if (Number.isNaN(expiresAt)) {
    return true
  }

  return Date.now() + refreshSkewMs >= expiresAt
}

function resolveRefreshSkewMs(value: number | undefined): number {
  if (value === undefined) {
    return DEFAULT_TOKEN_REFRESH_SKEW_MS
  }

  if (!Number.isFinite(value) || value < 0) {
    throw new Error('refreshSkewMs must be a non-negative finite number.')
  }

  return value
}
