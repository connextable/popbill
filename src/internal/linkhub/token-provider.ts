import type { CreateTokenProviderInput, LinkhubTokenResponse, TokenProvider } from './types'

export function createTokenProvider(input: CreateTokenProviderInput): TokenProvider {
  const tokenCache = new Map<string, LinkhubTokenResponse>()

  return {
    async getToken(businessNumber: string): Promise<LinkhubTokenResponse> {
      const cachedToken = tokenCache.get(businessNumber)
      if (cachedToken && !isExpiredToken(cachedToken)) {
        return cachedToken
      }

      const issuedToken = await input.authClient.issueToken({
        serviceId: input.serviceId,
        accessId: businessNumber,
        scopes: input.scopes,
        forwardedIp: input.forwardedIp,
      })

      tokenCache.set(businessNumber, issuedToken)
      return issuedToken
    },
  }
}

function isExpiredToken(token: LinkhubTokenResponse): boolean {
  const expiresAt = Date.parse(token.expiredAt)

  if (Number.isNaN(expiresAt)) {
    return true
  }

  return Date.now() >= expiresAt
}
