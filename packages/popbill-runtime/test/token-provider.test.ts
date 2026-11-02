import { createTokenProvider, LinkhubAuthScope } from '@connextable/popbill-runtime'
import type { LinkhubAuthClient, LinkhubTokenResponse } from '@/auth/types'

describe('createTokenProvider', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

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

  test('issues Juso tokens without forwarding the local cache key', async () => {
    const { authClient, issueTokenMock } = createMockAuthClient([createToken({ serviceId: 'JUSOLINK', scopes: ['200'] })])
    const tokenProvider = createTokenProvider({
      authClient,
      serviceId: 'JUSOLINK',
      scopes: ['200'],
    })

    await tokenProvider.getToken('local-cache-key')

    expect(issueTokenMock).toHaveBeenCalledWith(
      expect.objectContaining({
        serviceId: 'JUSOLINK',
        accessId: null,
        scopes: ['200'],
      })
    )
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

  test('reissues token inside refresh skew before expiration', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))

    const { authClient, issueTokenMock } = createMockAuthClient([
      createToken({ sessionToken: 'nearly-expired-token', expiredAt: '2026-01-01T00:00:30Z' }),
      createToken({ sessionToken: 'fresh-token', expiredAt: '2026-01-01T01:00:00Z' }),
    ])

    const tokenProvider = createTokenProvider({
      authClient,
      serviceId: 'POPBILL_TEST',
      scopes: [LinkhubAuthScope.Member],
    })

    const firstToken = await tokenProvider.getToken('1234567890')
    const secondToken = await tokenProvider.getToken('1234567890')

    expect(firstToken.sessionToken).toBe('nearly-expired-token')
    expect(secondToken.sessionToken).toBe('fresh-token')
    expect(issueTokenMock).toHaveBeenCalledTimes(2)
  })

  test('honors custom refresh skew', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))

    const { authClient, issueTokenMock } = createMockAuthClient([
      createToken({ sessionToken: 'nearly-expired-token', expiredAt: '2026-01-01T00:00:30Z' }),
      createToken({ sessionToken: 'fresh-token', expiredAt: '2026-01-01T01:00:00Z' }),
    ])

    const tokenProvider = createTokenProvider({
      authClient,
      serviceId: 'POPBILL_TEST',
      scopes: [LinkhubAuthScope.Member],
      refreshSkewMs: 0,
    })

    const firstToken = await tokenProvider.getToken('1234567890')
    const secondToken = await tokenProvider.getToken('1234567890')

    expect(firstToken.sessionToken).toBe('nearly-expired-token')
    expect(secondToken.sessionToken).toBe('nearly-expired-token')
    expect(issueTokenMock).toHaveBeenCalledTimes(1)
  })

  test('rejects invalid refresh skew', () => {
    const { authClient } = createMockAuthClient()

    expect(() => {
      createTokenProvider({
        authClient,
        serviceId: 'POPBILL_TEST',
        scopes: [LinkhubAuthScope.Member],
        refreshSkewMs: -1,
      })
    }).toThrow('refreshSkewMs must be a non-negative finite number.')

    expect(() => {
      createTokenProvider({
        authClient,
        serviceId: 'POPBILL_TEST',
        scopes: [LinkhubAuthScope.Member],
        refreshSkewMs: Number.NaN,
      })
    }).toThrow('refreshSkewMs must be a non-negative finite number.')
  })

  test('deduplicates concurrent token requests for same business number', async () => {
    let resolveToken: ((token: LinkhubTokenResponse) => void) | undefined
    const issueTokenMock = vi.fn<LinkhubAuthClient['issueToken']>(
      () =>
        new Promise<LinkhubTokenResponse>((resolve) => {
          resolveToken = resolve
        })
    )

    const tokenProvider = createTokenProvider({
      authClient: {
        issueToken: issueTokenMock,
      },
      serviceId: 'POPBILL_TEST',
      scopes: [LinkhubAuthScope.Member],
    })

    const firstPromise = tokenProvider.getToken('1234567890')
    const secondPromise = tokenProvider.getToken('1234567890')

    expect(issueTokenMock).toHaveBeenCalledTimes(1)

    resolveToken?.(createToken({ sessionToken: 'shared-token' }))

    const [firstToken, secondToken] = await Promise.all([firstPromise, secondPromise])

    expect(firstToken.sessionToken).toBe('shared-token')
    expect(secondToken.sessionToken).toBe('shared-token')
    expect(issueTokenMock).toHaveBeenCalledTimes(1)
  })

  test('invalidates only the requested member token', async () => {
    const { authClient, issueTokenMock } = createMockAuthClient([
      createToken({ sessionToken: 'member-a' }),
      createToken({ sessionToken: 'member-b' }),
      createToken({ sessionToken: 'member-a-new' }),
    ])
    const tokenProvider = createTokenProvider({ authClient, serviceId: 'POPBILL_TEST', scopes: ['member'] })

    await tokenProvider.getToken('1234567890')
    await tokenProvider.getToken('0987654321')
    tokenProvider.invalidate('1234567890')

    await expect(tokenProvider.getToken('1234567890')).resolves.toMatchObject({ sessionToken: 'member-a-new' })
    await expect(tokenProvider.getToken('0987654321')).resolves.toMatchObject({ sessionToken: 'member-b' })
    expect(issueTokenMock).toHaveBeenCalledTimes(3)
  })

  test('does not cache an invalidated in-flight token or remove a newer pending request', async () => {
    const resolvers: ((token: LinkhubTokenResponse) => void)[] = []
    const issueToken = vi.fn<LinkhubAuthClient['issueToken']>(() => new Promise((resolve) => resolvers.push(resolve)))
    const tokenProvider = createTokenProvider({ authClient: { issueToken }, serviceId: 'POPBILL_TEST', scopes: ['member'] })

    const invalidatedRequest = tokenProvider.getToken('1234567890')
    tokenProvider.invalidate('1234567890')
    const freshRequest = tokenProvider.getToken('1234567890')
    resolvers[0]?.(createToken({ sessionToken: 'invalidated-token' }))
    await invalidatedRequest

    const concurrentFreshRequest = tokenProvider.getToken('1234567890')
    expect(issueToken).toHaveBeenCalledTimes(2)
    resolvers[1]?.(createToken({ sessionToken: 'fresh-token' }))
    await expect(freshRequest).resolves.toMatchObject({ sessionToken: 'fresh-token' })
    await expect(concurrentFreshRequest).resolves.toMatchObject({ sessionToken: 'fresh-token' })
    await expect(tokenProvider.getToken('1234567890')).resolves.toMatchObject({ sessionToken: 'fresh-token' })
    expect(issueToken).toHaveBeenCalledTimes(2)
  })
})

function createMockAuthClient(tokens?: LinkhubTokenResponse[]): {
  authClient: LinkhubAuthClient
  issueTokenMock: ReturnType<typeof vi.fn>
} {
  const queue = tokens ?? [createToken({ sessionToken: 'token-1' })]
  const fallbackToken = queue[queue.length - 1] ?? createToken({ sessionToken: 'token-fallback' })
  let index = 0
  const issueTokenMock = vi.fn<LinkhubAuthClient['issueToken']>(async () => {
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
