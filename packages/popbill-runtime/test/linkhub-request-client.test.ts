import { createLinkhubRequestClient } from '@/api'
import { LinkhubApiBaseUrls } from '@/spec-constants'
import type { LinkhubTokenResponse, TokenProvider } from '@/auth'

describe('createLinkhubRequestClient', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('uses configured token cache key and api base url', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{"ok":true}', { status: 200 }))
    const getToken = vi.fn<TokenProvider['getToken']>(async () => createMockTokenResponse('TOKEN'))

    const requestClient = createLinkhubRequestClient({
      apiBaseUrl: LinkhubApiBaseUrls.JusoLink,
      timeoutMs: 1_000,
      tokenProvider: {
        getToken,
      },
      tokenCacheKey: 'ACCESS_ID',
      acceptEncoding: null,
    })

    await requestClient.requestJson({
      uri: '/Search?Searches=%EC%82%BC%EC%84%B1%EB%8F%99',
      method: 'GET',
      headers: {
        authorization: 'Bearer stale-token',
        'accept-encoding': 'identity',
        'X-Custom': 'retained',
      },
    })

    expect(getToken).toHaveBeenCalledWith('ACCESS_ID')

    const fetchCall = fetchSpy.mock.calls.at(-1)
    const requestUrl = fetchCall?.[0]
    const requestInit = fetchCall?.[1]
    const requestHeaders = new Headers(requestInit?.headers)

    expect(requestUrl).toBe('https://juso.linkhub.co.kr/Search?Searches=%EC%82%BC%EC%84%B1%EB%8F%99')
    expect(requestHeaders.get('Authorization')).toBe('Bearer TOKEN')
    expect(requestHeaders.get('Accept-Encoding')).toBe('identity')
    expect(requestHeaders.get('X-Custom')).toBe('retained')
  })

  test('wraps token issuance errors with issue_token stage', async () => {
    const tokenIssueError = new Error('Token issue failed')
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}', { status: 200 }))

    const requestClient = createLinkhubRequestClient({
      apiBaseUrl: LinkhubApiBaseUrls.JusoLink,
      timeoutMs: 1_000,
      tokenProvider: {
        getToken: vi.fn<TokenProvider['getToken']>(async () => {
          throw tokenIssueError
        }),
      },
      tokenCacheKey: 'ACCESS_ID',
      acceptEncoding: null,
    })

    const requestPromise = requestClient.requestJson({
      uri: '/Search?Searches=%EC%82%BC%EC%84%B1%EB%8F%99',
      method: 'GET',
    })

    await expect(requestPromise).rejects.toMatchObject({
      requestStage: 'issue_token',
      cause: tokenIssueError,
    })

    expect(fetchSpy).not.toHaveBeenCalled()
  })

  test('wraps api request errors with request_api stage', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('Service unavailable', { status: 503 }))

    const requestClient = createLinkhubRequestClient({
      apiBaseUrl: LinkhubApiBaseUrls.JusoLink,
      timeoutMs: 1_000,
      tokenProvider: {
        getToken: vi.fn<TokenProvider['getToken']>(async () => createMockTokenResponse('TOKEN')),
      },
      tokenCacheKey: 'ACCESS_ID',
      acceptEncoding: null,
    })

    const requestPromise = requestClient.requestJson({
      uri: '/Search?Searches=%EC%82%BC%EC%84%B1%EB%8F%99',
      method: 'GET',
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
    serviceId: 'JUSOLINK',
    linkId: 'LINK_ID',
    userId: 'user',
    partnerCode: 'partner',
    userCode: 'usercode',
    scopes: ['200'],
    ipAddress: '127.0.0.1',
    expiredAt: '2999-12-31T00:00:00Z',
  }
}
