import { createLinkhubAuthClient } from '@/internal/linkhub/auth-client'

describe('linkhub auth client', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('issues token with LINKHUB authorization header', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          session_token: 'token',
          expiration: '2099-01-01T00:00:00Z',
          serviceID: 'POPBILL_TEST',
        }),
        { status: 200 },
      ),
    )

    vi.stubGlobal('fetch', fetchMock)

    const authClient = createLinkhubAuthClient({
      linkId: 'TEST_LINK',
      secretKey: Buffer.from('secret').toString('base64'),
      useStaticIp: false,
      useGaIp: false,
      useLocalTime: true,
      timeoutMs: 1000,
    })

    const result = await authClient.issueToken({
      serviceId: 'POPBILL_TEST',
      accessId: '1234567890',
      scopes: ['member', '110'],
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)

    const secondArg = fetchMock.mock.calls[0]?.[1] as RequestInit
    const headers = secondArg.headers as Record<string, string>
    expect(headers['Authorization']).toContain('LINKHUB TEST_LINK ')
    expect(headers['x-lh-version']).toBe('2.0')
    expect(result).toMatchObject({
      sessionToken: 'token',
      serviceId: 'POPBILL_TEST',
      expiredAt: '2099-01-01T00:00:00Z',
    })
  })
})
