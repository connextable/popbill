import { createPopbillRequestClient } from '@/api'
import type { LinkhubTokenResponse, TokenProvider } from '@/auth/types'
import { sha1Base64 } from '@connextable/popbill-utils'

describe('createPopbillRequestClient', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('normalizes lowercase get method without applying HTTP method override', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}', { status: 200 }))

    const requestClient = createPopbillRequestClient({
      apiBaseUrl: 'https://popbill.example.com',
      timeoutMs: 1_000,
      tokenProvider: {
        getToken: vi.fn<TokenProvider['getToken']>(),
      },
      acceptEncoding: null,
    })

    await requestClient.requestJson({
      uri: '/Taxinvoice',
      method: 'get',
    })

    const fetchCall = fetchSpy.mock.calls.at(-1)
    const requestInit = fetchCall?.[1]
    const requestHeaders = requestInit?.headers as Record<string, string>

    expect(requestInit?.method).toBe('GET')
    expect(requestHeaders['X-HTTP-Method-Override']).toBeUndefined()
  })

  test('normalizes lowercase delete method and applies HTTP method override', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}', { status: 200 }))

    const requestClient = createPopbillRequestClient({
      apiBaseUrl: 'https://popbill.example.com',
      timeoutMs: 1_000,
      tokenProvider: {
        getToken: vi.fn<TokenProvider['getToken']>(),
      },
      acceptEncoding: null,
    })

    await requestClient.requestJson({
      uri: '/Taxinvoice/123',
      method: 'delete',
    })

    const fetchCall = fetchSpy.mock.calls.at(-1)
    const requestInit = fetchCall?.[1]
    const requestHeaders = requestInit?.headers as Record<string, string>

    expect(requestInit?.method).toBe('POST')
    expect(requestHeaders['X-HTTP-Method-Override']).toBe('DELETE')
  })

  test('applies bulk issue digest and submit id headers with lowercase method', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}', { status: 200 }))
    const messageBody = '{"invoices":[1,2,3]}'

    const requestClient = createPopbillRequestClient({
      apiBaseUrl: 'https://popbill.example.com',
      timeoutMs: 1_000,
      tokenProvider: {
        getToken: vi.fn<TokenProvider['getToken']>(),
      },
      acceptEncoding: null,
    })

    await requestClient.requestJson({
      uri: '/Taxinvoice',
      method: 'bulkissue',
      body: messageBody,
      submitId: 'SUBMIT-1',
    })

    const fetchCall = fetchSpy.mock.calls.at(-1)
    const requestInit = fetchCall?.[1]
    const requestHeaders = requestInit?.headers as Record<string, string>

    expect(requestInit?.method).toBe('POST')
    expect(requestHeaders['X-HTTP-Method-Override']).toBe('BULKISSUE')
    expect(requestHeaders['X-PB-MESSAGE-DIGEST']).toBe(sha1Base64(messageBody))
    expect(requestHeaders['X-PB-SUBMIT-ID']).toBe('SUBMIT-1')
  })

  test('wraps token issuance errors with issue_token stage', async () => {
    const tokenIssueError = new Error('Token issue failed')
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}', { status: 200 }))

    const requestClient = createPopbillRequestClient({
      apiBaseUrl: 'https://popbill.example.com',
      timeoutMs: 1_000,
      tokenProvider: {
        getToken: vi.fn<TokenProvider['getToken']>(async () => {
          throw tokenIssueError
        }),
      },
      acceptEncoding: null,
    })

    const requestPromise = requestClient.requestJson({
      uri: '/Taxinvoice',
      method: 'GET',
      corpNum: '1234567890',
    })

    await expect(requestPromise).rejects.toMatchObject({
      requestStage: 'issue_token',
      cause: tokenIssueError,
    })

    expect(fetchSpy).not.toHaveBeenCalled()
  })

  test('wraps api request errors with request_api stage', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('Service unavailable', { status: 503 }))

    const requestClient = createPopbillRequestClient({
      apiBaseUrl: 'https://popbill.example.com',
      timeoutMs: 1_000,
      tokenProvider: {
        getToken: vi.fn<TokenProvider['getToken']>(async () => createMockTokenResponse('session-token')),
      },
      acceptEncoding: null,
    })

    const requestPromise = requestClient.requestJson({
      uri: '/Taxinvoice',
      method: 'GET',
      corpNum: '1234567890',
    })

    await expect(requestPromise).rejects.toMatchObject({
      requestStage: 'request_api',
      cause: { status: 503, body: 'Service unavailable' },
    })
  })
})

function createMockTokenResponse(sessionToken: string): LinkhubTokenResponse {
  return {
    sessionToken,
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
