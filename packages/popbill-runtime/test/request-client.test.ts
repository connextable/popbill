import { createPopbillRequestClient } from '@/api'
import type { LinkhubTokenResponse, TokenProvider } from '@/auth/types'

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
    const requestHeaders = new Headers(requestInit?.headers)

    expect(requestInit?.method).toBe('GET')
    expect(requestHeaders.get('X-HTTP-Method-Override')).toBeNull()
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
    const requestHeaders = new Headers(requestInit?.headers)

    expect(requestInit?.method).toBe('POST')
    expect(requestHeaders.get('X-HTTP-Method-Override')).toBe('DELETE')
  })

  const messageBody = '{"invoices":[1,2,3]}'
  const paddedBody = new Uint8Array([0, ...new TextEncoder().encode(messageBody), 255])

  test.each([
    { name: 'string', body: messageBody },
    { name: 'offset byte view', body: paddedBody.subarray(1, -1) },
  ])('applies bulk issue headers and digest to $name bodies', async ({ body }) => {
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
      method: 'bulkissue',
      body,
      submitId: 'SUBMIT-1',
      headers: {
        'x-http-method-override': 'DELETE',
        'x-pb-message-digest': 'stale-digest',
        'x-pb-submit-id': 'stale-submit-id',
        'content-type': 'text/plain',
      },
    })

    const fetchCall = fetchSpy.mock.calls.at(-1)
    const requestInit = fetchCall?.[1]
    const requestHeaders = new Headers(requestInit?.headers)

    expect(requestInit?.method).toBe('POST')
    expect(requestHeaders.get('X-HTTP-Method-Override')).toBe('BULKISSUE')
    expect(requestHeaders.get('X-PB-MESSAGE-DIGEST')).toBe('qlHp+ILHyk1FW0Tkr2RDZ5B6hWU=')
    expect(requestHeaders.get('X-PB-SUBMIT-ID')).toBe('SUBMIT-1')
    expect(requestHeaders.get('Content-Type')).toBe('application/json;charset=utf-8')
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
