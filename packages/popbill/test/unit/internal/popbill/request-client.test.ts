import { createPopbillRequestClient } from '@/internal/popbill'
import { sha1Base64 } from '@/utils/crypto'
import type { LinkhubTokenResponse, TokenProvider } from '@/internal/linkhub/types'

function createToken(): LinkhubTokenResponse {
  return {
    sessionToken: 'session-token',
    serviceId: 'POPBILL_TEST',
    linkId: 'TEST_LINK_ID',
    userId: 'test-user',
    partnerCode: 'P0001',
    userCode: 'A0001',
    scopes: ['member', '110'],
    ipAddress: '127.0.0.1',
    expiredAt: '2099-01-01T00:00:00Z',
  }
}

function createTokenProvider(getToken = vi.fn().mockResolvedValue(createToken())): TokenProvider {
  return { getToken }
}

describe('popbill request client', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('sends default Accept-Encoding gzip and bearer authorization', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    const tokenProvider = createTokenProvider()
    const requestClient = createPopbillRequestClient({
      apiBaseUrl: 'https://popbill-test.linkhub.co.kr',
      timeoutMs: 1000,
      tokenProvider,
      acceptEncoding: 'gzip',
    })

    await requestClient.requestJson({
      uri: '/Taxinvoice/SELL/MGT-1',
      corpNum: '1234567890',
      userId: 'test-user',
      method: 'GET',
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const requestInit = fetchMock.mock.calls[0]?.[1] as RequestInit
    const headers = requestInit.headers as Record<string, string>

    expect(headers['Authorization']).toBe('Bearer session-token')
    expect(headers['User-Agent']).toBe('NODEJS POPBILL SDK')
    expect(headers['Accept-Encoding']).toBe('gzip')
    expect(headers['x-pb-userid']).toBe('test-user')
    expect(headers).not.toHaveProperty('Accept-Language')
  })

  test('omits Accept-Encoding when configured as null and includes Accept-Language', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    const requestClient = createPopbillRequestClient({
      apiBaseUrl: 'https://popbill-test.linkhub.co.kr',
      timeoutMs: 1000,
      tokenProvider: createTokenProvider(),
      acceptEncoding: null,
      acceptLanguage: 'en-US',
    })

    await requestClient.requestJson({
      uri: '/Taxinvoice/SELL/MGT-1',
      method: 'GET',
    })

    const requestInit = fetchMock.mock.calls[0]?.[1] as RequestInit
    const headers = requestInit.headers as Record<string, string>

    expect(headers).not.toHaveProperty('Accept-Encoding')
    expect(headers['Accept-Language']).toBe('en-US')
  })

  test('adds BULKISSUE headers with digest from raw request body', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    const requestClient = createPopbillRequestClient({
      apiBaseUrl: 'https://popbill-test.linkhub.co.kr',
      timeoutMs: 1000,
      tokenProvider: createTokenProvider(),
      acceptEncoding: 'gzip',
    })

    const bodyA = '{"cashbills":[{"mgtKey":"A"}]}'
    const bodyB = '{ "cashbills": [ { "mgtKey": "A" } ] }'

    await requestClient.requestJson({
      uri: '/Cashbill',
      corpNum: '1234567890',
      method: 'BULKISSUE',
      submitId: 'SUBMIT-ID',
      body: bodyA,
    })

    await requestClient.requestJson({
      uri: '/Cashbill',
      corpNum: '1234567890',
      method: 'BULKISSUE',
      submitId: 'SUBMIT-ID',
      body: bodyB,
    })

    const firstHeaders = (fetchMock.mock.calls[0]?.[1] as RequestInit).headers as Record<string, string>
    const secondHeaders = (fetchMock.mock.calls[1]?.[1] as RequestInit).headers as Record<string, string>

    expect(firstHeaders['X-HTTP-Method-Override']).toBe('BULKISSUE')
    expect(firstHeaders['X-PB-SUBMIT-ID']).toBe('SUBMIT-ID')
    expect(firstHeaders['X-PB-MESSAGE-DIGEST']).toBe(sha1Base64(bodyA))
    expect(secondHeaders['X-PB-MESSAGE-DIGEST']).toBe(sha1Base64(bodyB))
    expect(firstHeaders['X-PB-MESSAGE-DIGEST']).not.toBe(secondHeaders['X-PB-MESSAGE-DIGEST'])
  })

  test('throws stage error as issue_token when token provider fails', async () => {
    const tokenError = new Error('token issue failed')
    const requestClient = createPopbillRequestClient({
      apiBaseUrl: 'https://popbill-test.linkhub.co.kr',
      timeoutMs: 1000,
      tokenProvider: createTokenProvider(vi.fn().mockRejectedValue(tokenError)),
      acceptEncoding: 'gzip',
    })

    await expect(requestClient.requestJson({
      uri: '/Taxinvoice/SELL/MGT-1',
      corpNum: '1234567890',
      method: 'GET',
    })).rejects.toMatchObject({
      requestStage: 'issue_token',
      cause: tokenError,
    })
  })

  test('throws stage error as request_api when API request fails', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ code: -99999999, message: 'error' }), { status: 500 }))
    vi.stubGlobal('fetch', fetchMock)

    const requestClient = createPopbillRequestClient({
      apiBaseUrl: 'https://popbill-test.linkhub.co.kr',
      timeoutMs: 1000,
      tokenProvider: createTokenProvider(),
      acceptEncoding: 'gzip',
    })

    await expect(requestClient.requestJson({
      uri: '/Taxinvoice/SELL/MGT-1',
      corpNum: '1234567890',
      method: 'GET',
    })).rejects.toMatchObject({
      requestStage: 'request_api',
      cause: {
        status: 500,
      },
    })
  })
})
