import { createLinkhubAuthClient, type IssueTokenRequest } from '@/auth'

describe('createLinkhubAuthClient', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('retains local-time fallback when the server time request itself times out', async () => {
    const fetch = vi.fn<typeof globalThis.fetch>().mockImplementation(async (target, init) => {
      if (String(target).endsWith('/Time'))
        return await new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => reject(init.signal?.reason), { once: true })
        })
      return Response.json({ session_token: 'session', serviceID: 'POPBILL_TEST', expiration: '2099-01-01T00:00:00Z' })
    })
    const client = createLinkhubAuthClient({
      linkId: 'LINK',
      secretKey: Buffer.from('secret').toString('base64'),
      useLocalTime: false,
      timeoutMs: 25,
      fetch,
    })
    await expect(client.issueToken({ serviceId: 'POPBILL_TEST', accessId: '1234567890', scopes: ['member'] })).resolves.toMatchObject({
      sessionToken: 'session',
    })
    expect(fetch).toHaveBeenCalledTimes(2)
    expect(String(fetch.mock.calls[0]![0])).toMatch(/\/Time$/)
    expect(String(fetch.mock.calls[1]![0])).toMatch(/\/Token$/)
  })

  test.each([
    { name: 'default auth host', authBaseUrl: undefined, expectedUrl: 'https://auth.linkhub.co.kr/JUSOLINK/Token' },
    { name: 'custom auth host', authBaseUrl: 'https://custom-auth.example.com/', expectedUrl: 'https://custom-auth.example.com/JUSOLINK/Token' },
  ])('supports JUSOLINK with $name', async ({ authBaseUrl, expectedUrl }) => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          session_token: 'SESSION_TOKEN',
          serviceID: 'JUSOLINK',
          linkID: 'LINK_ID',
          userID: 'ACCESS_ID',
          partnerCode: 'PARTNER',
          usercode: 'USER_CODE',
          scope: ['200'],
          ipaddress: '127.0.0.1',
          expiration: '2999-12-31T00:00:00Z',
        }),
        { status: 200 }
      )
    )

    const authClient = createLinkhubAuthClient({
      linkId: 'LINK_ID',
      secretKey: Buffer.from('secret').toString('base64'),
      authBaseUrl,
      useLocalTime: true,
      timeoutMs: 1_000,
    })

    const token = await authClient.issueToken({
      serviceId: 'JUSOLINK',
      accessId: null,
      scopes: ['200'],
    })

    const fetchCall = fetchSpy.mock.calls.at(-1)
    const requestUrl = fetchCall?.[0]
    const requestInit = fetchCall?.[1]
    const requestHeaders = new Headers(requestInit?.headers)
    const authorizationHeader = requestHeaders.get('Authorization')

    expect(requestUrl).toBe(expectedUrl)
    expect(authorizationHeader?.startsWith('LINKHUB LINK_ID ')).toBe(true)
    expect(requestHeaders.get('x-lh-version')).toBe('2.0')
    expect(JSON.parse(requestInit?.body as string)).toEqual({ scope: ['200'] })
    expect(token.serviceId).toBe('JUSOLINK')
  })

  test.each<IssueTokenRequest>([
    { serviceId: 'JUSOLINK', accessId: null, scopes: ['member'] },
    { serviceId: 'POPBILL_TEST', accessId: '1234567890', scopes: ['200'] },
  ])('rejects scopes belonging to another service: $serviceId', async (request) => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}'))
    const authClient = createLinkhubAuthClient({
      linkId: 'LINK_ID',
      secretKey: Buffer.from('secret').toString('base64'),
    })

    await expect(authClient.issueToken(request)).rejects.toThrow('Unsupported Linkhub auth scope:')
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  test('rejects null access IDs for Popbill token requests', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}'))
    const authClient = createLinkhubAuthClient({
      linkId: 'LINK_ID',
      secretKey: Buffer.from('secret').toString('base64'),
    })

    await expect(authClient.issueToken({ serviceId: 'POPBILL_TEST', accessId: null, scopes: ['member'] })).rejects.toThrow(
      'Linkhub accessId is required for this service.'
    )
    expect(fetchSpy).not.toHaveBeenCalled()
  })
})
