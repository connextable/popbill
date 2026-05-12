import { createLinkhubAuthClient } from '@/auth'

describe('createLinkhubAuthClient', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('supports non-popbill service identifier such as JUSOLINK', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          session_token: 'SESSION_TOKEN',
          serviceID: 'JUSOLINK',
          linkID: 'LINK_ID',
          userID: 'ACCESS_ID',
          partnerCode: 'PARTNER',
          usercode: 'USER_CODE',
          scope: ['member'],
          ipaddress: '127.0.0.1',
          expiration: '2999-12-31T00:00:00Z',
        }),
        { status: 200 }
      )
    )

    const authClient = createLinkhubAuthClient({
      linkId: 'LINK_ID',
      secretKey: Buffer.from('secret').toString('base64'),
      useLocalTime: true,
      timeoutMs: 1_000,
    })

    const token = await authClient.issueToken({
      serviceId: 'JUSOLINK',
      accessId: 'ACCESS_ID',
      scopes: ['member'],
    })

    const fetchCall = fetchSpy.mock.calls.at(-1)
    const requestUrl = fetchCall?.[0]
    const requestInit = fetchCall?.[1]
    const requestHeaders = requestInit?.headers as Record<string, string>
    const authorizationHeader = requestHeaders['Authorization']

    expect(requestUrl).toBe('https://auth.linkhub.co.kr/JUSOLINK/Token')
    expect(authorizationHeader?.startsWith('LINKHUB LINK_ID ')).toBe(true)
    expect(requestHeaders['x-lh-version']).toBe('2.0')
    expect(token.serviceId).toBe('JUSOLINK')
  })

  test('uses authBaseUrl override when provided', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          session_token: 'SESSION_TOKEN',
          serviceID: 'JUSOLINK',
          linkID: 'LINK_ID',
          userID: 'ACCESS_ID',
          partnerCode: 'PARTNER',
          usercode: 'USER_CODE',
          scope: ['member'],
          ipaddress: '127.0.0.1',
          expiration: '2999-12-31T00:00:00Z',
        }),
        { status: 200 }
      )
    )

    const authClient = createLinkhubAuthClient({
      linkId: 'LINK_ID',
      secretKey: Buffer.from('secret').toString('base64'),
      authBaseUrl: 'https://custom-auth.example.com/',
      timeoutMs: 1_000,
    })

    await authClient.issueToken({
      serviceId: 'JUSOLINK',
      accessId: 'ACCESS_ID',
      scopes: ['member'],
    })

    const fetchCall = fetchSpy.mock.calls.at(-1)
    const requestUrl = fetchCall?.[0]
    expect(requestUrl).toBe('https://custom-auth.example.com/JUSOLINK/Token')
  })
})
