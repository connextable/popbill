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
    expect(typeof headers['x-lh-date']).toBe('string')
    expect(result).toMatchObject({
      sessionToken: 'token',
      serviceId: 'POPBILL_TEST',
      expiredAt: '2099-01-01T00:00:00Z',
    })
  })

  test('includes x-lh-forwarded header when forwardedIp is provided', async () => {
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
      useLocalTime: true,
    })

    await authClient.issueToken({
      serviceId: 'POPBILL_TEST',
      accessId: '1234567890',
      scopes: ['member', '110'],
      forwardedIp: '*',
    })

    const requestInit = fetchMock.mock.calls[0]?.[1] as RequestInit
    const headers = requestInit.headers as Record<string, string>
    expect(headers['x-lh-forwarded']).toBe('*')
  })

  test('uses /Time API result when useLocalTime is false', async () => {
    const serverTime = '2026-02-25T10:00:00Z'
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(serverTime, { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        session_token: 'token',
        expiration: '2099-01-01T00:00:00Z',
        serviceID: 'POPBILL_TEST',
      }), { status: 200 }))

    vi.stubGlobal('fetch', fetchMock)

    const authClient = createLinkhubAuthClient({
      linkId: 'TEST_LINK',
      secretKey: Buffer.from('secret').toString('base64'),
      useLocalTime: false,
    })

    await authClient.issueToken({
      serviceId: 'POPBILL_TEST',
      accessId: '1234567890',
      scopes: ['member', '110'],
    })

    expect(String(fetchMock.mock.calls[0]?.[0])).toContain('/Time')
    const tokenRequestHeaders = (fetchMock.mock.calls[1]?.[1] as RequestInit).headers as Record<string, string>
    expect(tokenRequestHeaders['x-lh-date']).toBe(serverTime)
  })

  test('falls back to local time when /Time API fails', async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error('network error'))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        session_token: 'token',
        expiration: '2099-01-01T00:00:00Z',
        serviceID: 'POPBILL_TEST',
      }), { status: 200 }))

    vi.stubGlobal('fetch', fetchMock)

    const authClient = createLinkhubAuthClient({
      linkId: 'TEST_LINK',
      secretKey: Buffer.from('secret').toString('base64'),
      useLocalTime: false,
    })

    await authClient.issueToken({
      serviceId: 'POPBILL_TEST',
      accessId: '1234567890',
      scopes: ['member', '110'],
    })

    expect(String(fetchMock.mock.calls[0]?.[0])).toContain('/Time')
    const tokenRequestHeaders = (fetchMock.mock.calls[1]?.[1] as RequestInit).headers as Record<string, string>
    expect(typeof tokenRequestHeaders['x-lh-date']).toBe('string')
  })
})
