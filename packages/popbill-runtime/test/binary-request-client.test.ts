import { createPopbillRequestClient } from '@/api'
import type { LinkhubTokenResponse, TokenProvider } from '@/auth/types'

function token(): LinkhubTokenResponse {
  return {
    sessionToken: 'binary-token',
    serviceId: 'POPBILL_TEST',
    linkId: 'LINK_ID',
    userId: 'user',
    partnerCode: 'partner',
    userCode: 'usercode',
    scopes: ['member'],
    ipAddress: '127.0.0.1',
    expiredAt: '2999-12-31T00:00:00Z',
  }
}

function client(getToken: TokenProvider['getToken'] = vi.fn<TokenProvider['getToken']>(async () => token())) {
  return createPopbillRequestClient({
    apiBaseUrl: 'https://popbill.example.com/',
    timeoutMs: 1_000,
    tokenProvider: { getToken },
    acceptLanguage: 'ko-KR',
  })
}

describe('binary request client', () => {
  afterEach(() => vi.restoreAllMocks())

  test('returns original bytes with the same authenticated GET headers as JSON requests', async () => {
    const bytes = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0, 0xff, 0xfe, 0x80])
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(bytes, { headers: { 'Content-Type': 'application/pdf' } }))
    const getToken = vi.fn<TokenProvider['getToken']>(async () => token())
    const result = await client(getToken).requestBinary({
      uri: '/Taxinvoice/SELL/KEY?PDF',
      corpNum: '1234567890',
      userId: 'pdf-user',
      method: 'get',
      headers: { authorization: 'stale', 'X-Custom': 'value' },
    })
    expect([...result]).toEqual([...bytes])
    expect(result).toBeInstanceOf(Uint8Array)
    expect(getToken).toHaveBeenCalledWith('1234567890')
    const [url, init] = fetchSpy.mock.calls[0]!
    expect(url).toBe('https://popbill.example.com/Taxinvoice/SELL/KEY?PDF')
    expect(init?.method).toBe('GET')
    const headers = new Headers(init?.headers)
    expect(headers.get('Authorization')).toBe('Bearer binary-token')
    expect(headers.get('X-PB-UserID')).toBe('pdf-user')
    expect(headers.get('Accept-Language')).toBe('ko-KR')
    expect(headers.get('X-Custom')).toBe('value')
  })

  test.each([200, 400])('preserves a JSON API error received with HTTP %i', async (status) => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('{"code":-11000001,"message":"문서가 없습니다."}', { status, headers: { 'Content-Type': 'Application/JSON; charset=utf-8' } })
    )
    await expect(client().requestBinary({ uri: '/Taxinvoice/SELL/MISSING?PDF', corpNum: '1234567890' })).rejects.toMatchObject({
      requestStage: 'request_api',
      cause: { status, body: { code: -11000001, message: '문서가 없습니다.' } },
    })
  })

  test('preserves non-JSON HTTP errors rather than treating them as PDF data', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('Service unavailable', { status: 503, headers: { 'Content-Type': 'text/plain' } }))
    await expect(client().requestBinary({ uri: '/Taxinvoice/SELL/KEY?PDF' })).rejects.toMatchObject({
      requestStage: 'request_api',
      cause: { status: 503, body: 'Service unavailable' },
    })
  })

  test('token failure retains issue_token stage and never calls the download endpoint', async () => {
    const tokenError = new Error('Token failed')
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    const getToken = vi.fn<TokenProvider['getToken']>(async () => {
      throw tokenError
    })
    await expect(client(getToken).requestBinary({ uri: '/Taxinvoice/SELL/KEY?PDF', corpNum: '1234567890' })).rejects.toMatchObject({
      requestStage: 'issue_token',
      cause: tokenError,
    })
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  test('network failure retains request_api stage and its original cause', async () => {
    const networkError = new TypeError('Connection reset')
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(networkError)
    await expect(client().requestBinary({ uri: '/Taxinvoice/SELL/KEY?PDF', corpNum: '1234567890' })).rejects.toMatchObject({
      requestStage: 'request_api',
      cause: { name: 'PopbillFetchRequestError', cause: networkError },
    })
  })

  test('does not issue a token for requests without a corporation number', async () => {
    const getToken = vi.fn<TokenProvider['getToken']>()
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(new Uint8Array([0, 255]), { headers: { 'Content-Type': 'application/octet-stream' } })
    )
    await expect(client(getToken).requestBinary({ uri: '/download' })).resolves.toEqual(new Uint8Array([0, 255]))
    expect(getToken).not.toHaveBeenCalled()
  })
})
