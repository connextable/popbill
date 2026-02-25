import { createTokenProvider } from '@/internal/linkhub/token-provider'
import type { LinkhubTokenResponse } from '@/internal/linkhub/types'

function createToken(expiredAt: string): LinkhubTokenResponse {
  return {
    sessionToken: `session-token-${expiredAt}`,
    serviceId: 'POPBILL_TEST',
    linkId: 'TEST_LINK_ID',
    userId: 'test-user',
    partnerCode: 'P0001',
    userCode: 'A0001',
    scopes: ['member'],
    ipAddress: '127.0.0.1',
    expiredAt,
  }
}

describe('token provider', () => {
  test('reuses in-flight token issue request for the same business number', async () => {
    let resolveIssue: ((value: LinkhubTokenResponse) => void) | undefined
    const issuePromise = new Promise<LinkhubTokenResponse>((resolve) => {
      resolveIssue = resolve
    })

    const issueToken = vi.fn().mockReturnValue(issuePromise)
    const provider = createTokenProvider({
      authClient: { issueToken },
      serviceId: 'POPBILL_TEST',
      scopes: ['member'],
    })

    const first = provider.getToken('1234567890')
    const second = provider.getToken('1234567890')

    expect(issueToken).toHaveBeenCalledTimes(1)

    resolveIssue?.(createToken('2099-01-01T00:00:00Z'))

    const [firstToken, secondToken] = await Promise.all([first, second])

    expect(firstToken).toEqual(secondToken)
    expect(issueToken).toHaveBeenCalledTimes(1)
  })

  test('returns cached token until it is expired', async () => {
    const issueToken = vi.fn().mockResolvedValue(createToken('2099-01-01T00:00:00Z'))
    const provider = createTokenProvider({
      authClient: { issueToken },
      serviceId: 'POPBILL_TEST',
      scopes: ['member'],
    })

    await provider.getToken('1234567890')
    await provider.getToken('1234567890')

    expect(issueToken).toHaveBeenCalledTimes(1)
  })

  test('issues a new token when cached token is expired', async () => {
    const issueToken = vi
      .fn()
      .mockResolvedValueOnce(createToken('2000-01-01T00:00:00Z'))
      .mockResolvedValueOnce(createToken('2099-01-01T00:00:00Z'))

    const provider = createTokenProvider({
      authClient: { issueToken },
      serviceId: 'POPBILL_TEST',
      scopes: ['member'],
    })

    const first = await provider.getToken('1234567890')
    const second = await provider.getToken('1234567890')

    expect(first.expiredAt).toBe('2000-01-01T00:00:00Z')
    expect(second.expiredAt).toBe('2099-01-01T00:00:00Z')
    expect(issueToken).toHaveBeenCalledTimes(2)
  })
})
