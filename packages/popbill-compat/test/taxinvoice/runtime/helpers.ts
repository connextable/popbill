import * as compat from '@/index'
import * as promiseCompat from '@/promise/index'

export { compat, promiseCompat }

export function asError(error: unknown): Error {
  if (error instanceof Error) {
    return error
  }

  return new Error(String(error))
}

export function createTokenResponseBody() {
  return {
    session_token: 'session-token',
    expiration: '2099-01-01T00:00:00Z',
    serviceID: 'POPBILL_TEST',
  }
}

export function toJsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  })
}

export function stubFetchResponses(...responses: Response[]): ReturnType<typeof vi.fn> {
  const fetchMock = vi.fn<typeof fetch>()

  for (const response of responses) {
    fetchMock.mockResolvedValueOnce(response)
  }

  vi.stubGlobal('fetch', fetchMock)

  return fetchMock
}

export function configureCompat(defaultErrorHandler?: (error: unknown) => void) {
  const nextConfig = {
    LinkID: 'TEST_LINK_ID',
    SecretKey: Buffer.from('secret').toString('base64'),
    IsTest: true,
    defaultErrorHandler,
  }

  compat.config(nextConfig)
  promiseCompat.config(nextConfig)
}

export function expectTaxinvoiceRequestPath(fetchMock: ReturnType<typeof vi.fn>, expectedPath: string) {
  expect(String(fetchMock.mock.calls[1]?.[0])).toContain(expectedPath)
}

export function getTaxinvoiceRequestInit(fetchMock: ReturnType<typeof vi.fn>): RequestInit {
  return fetchMock.mock.calls[1]?.[1] as RequestInit
}
