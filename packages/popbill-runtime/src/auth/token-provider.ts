import type { CreateTokenProviderInput, LinkhubTokenResponse, TokenProvider } from './types'

const DEFAULT_TOKEN_REFRESH_SKEW_MS = 60_000

export function createTokenProvider(input: CreateTokenProviderInput): TokenProvider {
  const tokenCache = new Map<string, LinkhubTokenResponse>()
  const pendingRequests = new Map<string, Promise<LinkhubTokenResponse>>()
  const refreshSkewMs = resolveRefreshSkewMs(input.refreshSkewMs)

  return {
    async getToken(businessNumber: string): Promise<LinkhubTokenResponse> {
      const cachedToken = tokenCache.get(businessNumber)
      if (cachedToken && !isExpiredToken(cachedToken, refreshSkewMs)) {
        return cachedToken
      }

      const pendingRequest = pendingRequests.get(businessNumber)
      if (pendingRequest) {
        return pendingRequest
      }

      const issueTokenPromise = input.authClient
        .issueToken({
          serviceId: input.serviceId,
          accessId: businessNumber,
          scopes: input.scopes,
          forwardedIp: input.forwardedIp,
        })
        .then((issuedToken) => {
          tokenCache.set(businessNumber, issuedToken)
          return issuedToken
        })
        .finally(() => {
          pendingRequests.delete(businessNumber)
        })

      pendingRequests.set(businessNumber, issueTokenPromise)

      return issueTokenPromise
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
