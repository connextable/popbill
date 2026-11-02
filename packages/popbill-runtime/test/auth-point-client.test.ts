import { createLinkhubAuthClient, type LinkhubAuthClientConfig, type LinkhubTokenResponse } from '@/auth'

describe('Linkhub auth-host point APIs', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  test.each([
    { name: 'member balance', method: 'getBalance', resource: 'Point' },
    { name: 'partner balance', method: 'getPartnerBalance', resource: 'PartnerPoint' },
  ] as const)('preserves the decimal string returned for $name', async ({ method, resource }) => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify({ remainPoint: '9007199254740993.25', defUsedPoint: '0' })))
    const authClient = createLinkhubAuthClient(createConfig())

    await expect(authClient[method](createToken())).resolves.toBe('9007199254740993.25')

    expect(fetchSpy).toHaveBeenCalledTimes(1)
    const [url, init] = fetchSpy.mock.calls[0] ?? []
    expect(url).toBe(`https://auth.linkhub.co.kr/POPBILL_TEST/${resource}`)
    expect(init?.method).toBe('GET')
    expect(init?.body).toBeUndefined()
    expect(new Headers(init?.headers).get('Authorization')).toBe('Bearer SESSION_TOKEN')
    expect(new Headers(init?.headers).get('User-Agent')).toBe('NODEJS LINKHUB SDK')
  })

  test.each([
    { name: 'default', options: {}, host: 'https://auth.linkhub.co.kr' },
    { name: 'static', options: { useStaticIp: true }, host: 'https://static-auth.linkhub.co.kr' },
    { name: 'GA over static', options: { useStaticIp: true, useGaIp: true }, host: 'https://ga-auth.linkhub.co.kr' },
    {
      name: 'custom over GA',
      options: { authBaseUrl: ' https://custom-auth.example.com/ ', useGaIp: true },
      host: 'https://custom-auth.example.com',
    },
  ])('uses $name auth host and the production token service ID', async ({ options, host }) => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{"url":"https://popbill.com/charge"}'))
    const authClient = createLinkhubAuthClient(createConfig(options))

    await expect(authClient.getPartnerURL(createToken('POPBILL'), 'CHRG')).resolves.toBe('https://popbill.com/charge')
    expect(fetchSpy.mock.calls[0]?.[0]).toBe(`${host}/POPBILL/URL?TG=CHRG`)
  })

  test('encodes the partner URL target as one query value', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{"url":"https://popbill.com/charge"}'))
    const authClient = createLinkhubAuthClient(createConfig())

    await authClient.getPartnerURL(createToken(), 'CHRG&other=value')

    expect(fetchSpy.mock.calls[0]?.[0]).toBe('https://auth.linkhub.co.kr/POPBILL_TEST/URL?TG=CHRG%26other%3Dvalue')
  })

  test('preserves the auth-host error body and HTTP status for compat normalization', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{"code":-99910004,"message":"Token decryption failed."}', { status: 401 }))
    const authClient = createLinkhubAuthClient(createConfig())

    await expect(authClient.getBalance(createToken())).rejects.toMatchObject({
      requestStage: 'request_api',
      cause: { status: 401, body: { code: -99910004, message: 'Token decryption failed.' } },
    })
  })

  test('preserves network failures through the existing request client', async () => {
    const networkError = new Error('Network unavailable')
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(networkError)
    const authClient = createLinkhubAuthClient(createConfig())

    await expect(authClient.getPartnerBalance(createToken())).rejects.toMatchObject({
      requestStage: 'request_api',
      cause: networkError,
    })
  })
})

function createConfig(overrides: Partial<LinkhubAuthClientConfig> = {}): LinkhubAuthClientConfig {
  return { linkId: 'LINK_ID', secretKey: Buffer.from('secret').toString('base64'), timeoutMs: 1_000, ...overrides }
}

function createToken(serviceId: LinkhubTokenResponse['serviceId'] = 'POPBILL_TEST'): LinkhubTokenResponse {
  return {
    sessionToken: 'SESSION_TOKEN',
    serviceId,
    linkId: 'LINK_ID',
    userId: '1234567890',
    partnerCode: 'PARTNER',
    userCode: 'USER',
    scopes: ['member'],
    ipAddress: '127.0.0.1',
    expiredAt: '2999-12-31T00:00:00Z',
  }
}
