import { createTokenProvider, LinkhubAuthScope } from '@connextable/popbill-runtime'
import type { LinkhubAuthClient, LinkhubTokenResponse } from '@/auth/types'

describe('createTokenProvider', () => {
  test('returns cached token before expiration', async () => {
    const { authClient, issueTokenMock } = createMockAuthClient()
    const tokenProvider = createTokenProvider({
      authClient,
      serviceId: 'POPBILL_TEST',
      scopes: [LinkhubAuthScope.Member],
    })

    const firstToken = await tokenProvider.getToken('1234567890')
    const secondToken = await tokenProvider.getToken('1234567890')

    expect(firstToken.sessionToken).toBe(secondToken.sessionToken)
    expect(issueTokenMock).toHaveBeenCalledTimes(1)
  })

  test('reissues token after expiration', async () => {
    const { authClient, issueTokenMock } = createMockAuthClient([
      createToken({ sessionToken: 'expired-token', expiredAt: '2000-01-01T00:00:00Z' }),
      createToken({ sessionToken: 'fresh-token' }),
    ])

    const tokenProvider = createTokenProvider({
      authClient,
      serviceId: 'POPBILL_TEST',
      scopes: [LinkhubAuthScope.Member],
    })

    const firstToken = await tokenProvider.getToken('1234567890')
    const secondToken = await tokenProvider.getToken('1234567890')

    expect(firstToken.sessionToken).toBe('expired-token')
    expect(secondToken.sessionToken).toBe('fresh-token')
    expect(issueTokenMock).toHaveBeenCalledTimes(2)
  })
})

function createMockAuthClient(tokens?: LinkhubTokenResponse[]): {
  authClient: LinkhubAuthClient
  issueTokenMock: ReturnType<typeof vi.fn>
} {
  const queue = tokens ?? [createToken({ sessionToken: 'token-1' })]
  const fallbackToken = queue[queue.length - 1] ?? createToken({ sessionToken: 'token-fallback' })
  let index = 0
  const issueTokenMock = vi.fn(async () => {
    const token = queue[index] ?? fallbackToken
    index += 1
    return token
  })

  return {
    authClient: {
      issueToken: issueTokenMock,
    },
    issueTokenMock,
  }
}

function createToken(overrides: Partial<LinkhubTokenResponse>): LinkhubTokenResponse {
  return {
    sessionToken: overrides.sessionToken ?? 'token-default',
    serviceId: overrides.serviceId ?? 'POPBILL_TEST',
    linkId: overrides.linkId ?? 'LINK_ID',
    userId: overrides.userId ?? 'user',
    partnerCode: overrides.partnerCode ?? 'partner',
    userCode: overrides.userCode ?? 'usercode',
    scopes: overrides.scopes ?? [LinkhubAuthScope.Member],
    ipAddress: overrides.ipAddress ?? '127.0.0.1',
    expiredAt: overrides.expiredAt ?? '2999-12-31T00:00:00Z',
  }
}
