import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import * as compat from '@/index'
import * as promiseCompat from '@/promise/index'
import type { TaxInvoiceIssueApiResponse } from '@connextable/popbill-spec'

function createTokenResponseBody() {
  return {
    session_token: 'session-token',
    expiration: '2099-01-01T00:00:00Z',
    serviceID: 'POPBILL_TEST',
  }
}

function toJsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  })
}

function stubFetchResponses(...responses: Response[]) {
  const fetchMock = vi.fn()

  for (const response of responses) {
    fetchMock.mockResolvedValueOnce(response)
  }

  vi.stubGlobal('fetch', fetchMock)

  return fetchMock
}

function configureCompat(defaultErrorHandler?: (error: unknown) => void) {
  const nextConfig = {
    LinkID: 'TEST_LINK_ID',
    SecretKey: Buffer.from('secret').toString('base64'),
    IsTest: true,
    defaultErrorHandler,
  }

  compat.config(nextConfig)
  promiseCompat.config(nextConfig)
}

function expectTaxinvoiceRequestPath(fetchMock: ReturnType<typeof vi.fn>, expectedPath: string) {
  expect(String(fetchMock.mock.calls[1]?.[0])).toContain(expectedPath)
}

function getTaxinvoiceRequestInit(fetchMock: ReturnType<typeof vi.fn>): RequestInit {
  return fetchMock.mock.calls[1]?.[1] as RequestInit
}

describe('taxinvoice runtime methods', () => {
  beforeEach(() => {
    configureCompat()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  test('callback issue supports legacy overload without memo', async () => {
    const issueResponse: TaxInvoiceIssueApiResponse = {
      code: 1,
      message: 'issued',
      ntsConfirmNum: '20260225-0001',
    }
    const fetchMock = stubFetchResponses(
      toJsonResponse(createTokenResponseBody()),
      toJsonResponse(issueResponse),
    )
    const service = compat.TaxinvoiceService() as unknown as {
      issue: (...args: unknown[]) => void
    }

    const resolved = await new Promise<TaxInvoiceIssueApiResponse>((resolve, reject) => {
      service.issue(
        '1234567890',
        'SELL',
        'MGT-001',
        (response: TaxInvoiceIssueApiResponse) => resolve(response),
        (error: unknown) => reject(error),
      )
    })

    expect(resolved).toMatchObject(issueResponse)
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expectTaxinvoiceRequestPath(fetchMock, '/Taxinvoice/SELL/MGT-001')

    const requestInit = getTaxinvoiceRequestInit(fetchMock)
    const requestHeaders = requestInit.headers as Record<string, string>
    expect(requestHeaders['X-HTTP-Method-Override']).toBe('ISSUE')
    expect(requestHeaders).not.toHaveProperty('x-pb-userid')
    expect(requestInit.body).toBe('{"forceIssue":false}')
  })

  test('callback issue prioritizes single optional string as userId', async () => {
    const issueResponse: TaxInvoiceIssueApiResponse = {
      code: 1,
      message: 'issued',
    }
    const fetchMock = stubFetchResponses(
      toJsonResponse(createTokenResponseBody()),
      toJsonResponse(issueResponse),
    )
    const service = compat.TaxinvoiceService() as unknown as {
      issue: (...args: unknown[]) => void
    }

    await new Promise<void>((resolve, reject) => {
      service.issue(
        '1234567890',
        'SELL',
        'MGT-002',
        '발행메모',
        'test-user',
        () => resolve(),
        (error: unknown) => reject(error),
      )
    })

    const requestInit = getTaxinvoiceRequestInit(fetchMock)
    const requestHeaders = requestInit.headers as Record<string, string>
    expect(requestHeaders['x-pb-userid']).toBe('test-user')
    expect(JSON.parse(requestInit.body as string)).toEqual({
      memo: '발행메모',
      forceIssue: false,
    })
  })

  test('callback issue supports full argument shape with emailSubject and forceIssue', async () => {
    const issueResponse: TaxInvoiceIssueApiResponse = {
      code: 1,
      message: 'issued',
    }
    const fetchMock = stubFetchResponses(
      toJsonResponse(createTokenResponseBody()),
      toJsonResponse(issueResponse),
    )
    const service = compat.TaxinvoiceService() as unknown as {
      issue: (...args: unknown[]) => void
    }

    await new Promise<void>((resolve, reject) => {
      service.issue(
        '1234567890',
        'SELL',
        'MGT-003',
        '발행메모',
        '안내 메일 제목',
        true,
        'test-user',
        () => resolve(),
        (error: unknown) => reject(error),
      )
    })

    const requestInit = getTaxinvoiceRequestInit(fetchMock)
    const requestHeaders = requestInit.headers as Record<string, string>
    expect(requestHeaders['x-pb-userid']).toBe('test-user')
    expect(JSON.parse(requestInit.body as string)).toEqual({
      memo: '발행메모',
      emailSubject: '안내 메일 제목',
      forceIssue: true,
    })
  })

  test('promise issue treats single optional string as userId', async () => {
    const issueResponse: TaxInvoiceIssueApiResponse = {
      code: 1,
      message: 'issued',
    }
    const fetchMock = stubFetchResponses(
      toJsonResponse(createTokenResponseBody()),
      toJsonResponse(issueResponse),
    )

    await promiseCompat.TaxinvoiceService().issue(
      '1234567890',
      'SELL',
      'MGT-004',
      '발행메모',
      'promise-user',
    )

    const requestInit = getTaxinvoiceRequestInit(fetchMock)
    const requestHeaders = requestInit.headers as Record<string, string>
    expect(requestHeaders['x-pb-userid']).toBe('promise-user')
    expect(JSON.parse(requestInit.body as string)).toEqual({
      memo: '발행메모',
      forceIssue: false,
    })
  })

  test('callback and promise URL methods return string URL', async () => {
    const callbackFetchMock = stubFetchResponses(
      toJsonResponse(createTokenResponseBody()),
      toJsonResponse({ url: 'https://example.com/view' }),
    )

    const callbackUrl = await new Promise<string>((resolve, reject) => {
      compat.TaxinvoiceService().getViewURL(
        '1234567890',
        'SELL',
        'MGT-VIEW',
        (url: string) => resolve(url),
        (error: unknown) => reject(error),
      )
    })

    expect(callbackUrl).toBe('https://example.com/view')
    expectTaxinvoiceRequestPath(callbackFetchMock, '/Taxinvoice/SELL/MGT-VIEW?TG=VIEW')

    const promiseFetchMock = stubFetchResponses(
      toJsonResponse(createTokenResponseBody()),
      toJsonResponse({ url: 'https://example.com/pdf' }),
    )

    const promiseUrl = await promiseCompat.TaxinvoiceService().getPDFURL('1234567890', 'SELL', 'MGT-PDF', 'pdf-user')
    expect(promiseUrl).toBe('https://example.com/pdf')
    expectTaxinvoiceRequestPath(promiseFetchMock, '/Taxinvoice/SELL/MGT-PDF?TG=PDF')
    const requestHeaders = getTaxinvoiceRequestInit(promiseFetchMock).headers as Record<string, string>
    expect(requestHeaders['x-pb-userid']).toBe('pdf-user')
  })

  test('getURL returns string URL in callback and promise paths', async () => {
    const callbackFetchMock = stubFetchResponses(
      toJsonResponse(createTokenResponseBody()),
      toJsonResponse({ url: 'https://example.com/tbox' }),
    )

    const callbackUrl = await new Promise<string>((resolve, reject) => {
      compat.TaxinvoiceService().getURL(
        '1234567890',
        'TBOX',
        (url: string) => resolve(url),
        (error: unknown) => reject(error),
      )
    })

    expect(callbackUrl).toBe('https://example.com/tbox')
    expectTaxinvoiceRequestPath(callbackFetchMock, '/Taxinvoice?TG=TBOX')

    const promiseFetchMock = stubFetchResponses(
      toJsonResponse(createTokenResponseBody()),
      toJsonResponse({ url: 'https://example.com/sbox' }),
    )

    const promiseUrl = await promiseCompat.TaxinvoiceService().getURL('1234567890', 'SBOX', 'menu-user')
    expect(promiseUrl).toBe('https://example.com/sbox')
    expectTaxinvoiceRequestPath(promiseFetchMock, '/Taxinvoice?TG=SBOX')

    const requestHeaders = getTaxinvoiceRequestInit(promiseFetchMock).headers as Record<string, string>
    expect(requestHeaders['x-pb-userid']).toBe('menu-user')
  })

  test('getMassPrintURL sends POST body and returns URL string', async () => {
    const fetchMock = stubFetchResponses(
      toJsonResponse(createTokenResponseBody()),
      toJsonResponse({ url: 'https://example.com/mass-print' }),
    )

    const resultUrl = await new Promise<string>((resolve, reject) => {
      compat.TaxinvoiceService().getMassPrintURL(
        '1234567890',
        'SELL',
        ['MGT-101', 'MGT-102'],
        'mass-user',
        (url: string) => resolve(url),
        (error: unknown) => reject(error),
      )
    })

    expect(resultUrl).toBe('https://example.com/mass-print')
    expectTaxinvoiceRequestPath(fetchMock, '/Taxinvoice/SELL?Print')

    const requestInit = getTaxinvoiceRequestInit(fetchMock)
    expect(requestInit.method).toBe('POST')
    expect(requestInit.body).toBe('["MGT-101","MGT-102"]')

    const requestHeaders = requestInit.headers as Record<string, string>
    expect(requestHeaders['x-pb-userid']).toBe('mass-user')
  })

  test('validation errors block network for callback and promise', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    const callbackError = await new Promise<unknown>((resolve) => {
      compat.TaxinvoiceService().getViewURL(
        '',
        'SELL',
        'MGT-005',
        () => resolve(new Error('unexpected success')),
        (error: unknown) => resolve(error),
      )
    })

    expect(callbackError).toMatchObject({
      code: -99999999,
      message: '팝빌회원 사업자번호가 입력되지 않았습니다.',
    })

    await expect(
      promiseCompat.TaxinvoiceService().getMassPrintURL('1234567890', 'SELL', []),
    ).rejects.toMatchObject({
      code: -99999999,
      message: '문서번호배열이 입력되지 않았습니다.',
    })

    expect(fetchMock).not.toHaveBeenCalled()
  })

  test('getURL validates TOGO and blocks network', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    const missingTogoError = await new Promise<unknown>((resolve) => {
      ;(compat.TaxinvoiceService().getURL as (...args: unknown[]) => void)(
        '1234567890',
        '',
        () => resolve(new Error('unexpected success')),
        (error: unknown) => resolve(error),
      )
    })

    expect(missingTogoError).toMatchObject({
      code: -99999999,
      message: '접근 메뉴가 입력되지 않았습니다.',
    })

    const invalidTogoError = await new Promise<unknown>((resolve) => {
      ;(compat.TaxinvoiceService().getURL as (...args: unknown[]) => void)(
        '1234567890',
        'INVALID',
        () => resolve(new Error('unexpected success')),
        (error: unknown) => resolve(error),
      )
    })

    expect(invalidTogoError).toMatchObject({
      code: -99999999,
      message: '접근 메뉴가 올바르지 않습니다.',
    })

    await expect(
      (promiseCompat.TaxinvoiceService().getURL as (...args: unknown[]) => Promise<string>)('1234567890', 'INVALID'),
    ).rejects.toMatchObject({
      code: -99999999,
      message: '접근 메뉴가 올바르지 않습니다.',
    })

    expect(fetchMock).not.toHaveBeenCalled()
  })

  test('callback path prefers error callback over defaultErrorHandler', async () => {
    const defaultErrorHandler = vi.fn()
    configureCompat(defaultErrorHandler)
    const fetchMock = stubFetchResponses(
      toJsonResponse(createTokenResponseBody()),
      toJsonResponse({ code: -12345, message: 'Bad request' }, 400),
    )
    const callbackError = vi.fn()

    await new Promise<void>((resolve) => {
      compat.TaxinvoiceService().getViewURL(
        '1234567890',
        'SELL',
        'MGT-ERROR-1',
        () => resolve(),
        (error: unknown) => {
          callbackError(error)
          resolve()
        },
      )
    })

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(callbackError).toHaveBeenCalledTimes(1)
    expect(callbackError).toHaveBeenCalledWith(expect.objectContaining({
      code: -12345,
      stage: 'request_api',
    }))
    expect(defaultErrorHandler).not.toHaveBeenCalled()
  })

  test('callback and promise path use defaultErrorHandler fallback and reject', async () => {
    const defaultErrorHandler = vi.fn()
    configureCompat(defaultErrorHandler)

    const callbackFetchMock = stubFetchResponses(
      toJsonResponse(createTokenResponseBody()),
      toJsonResponse({ code: -12345, message: 'Bad request' }, 400),
    )

    compat.TaxinvoiceService().getViewURL('1234567890', 'SELL', 'MGT-ERROR-2', () => {})

    await new Promise(resolve => setTimeout(resolve, 0))
    expect(defaultErrorHandler).toHaveBeenCalledTimes(1)

    expect(callbackFetchMock).toHaveBeenCalledTimes(2)

    const promiseFetchMock = stubFetchResponses(
      toJsonResponse(createTokenResponseBody()),
      toJsonResponse({ code: -22345, message: 'Promise bad request' }, 400),
    )

    await expect(
      promiseCompat.TaxinvoiceService().getPDFURL('1234567890', 'SELL', 'MGT-ERROR-3'),
    ).rejects.toMatchObject({
      code: -22345,
      stage: 'request_api',
    })

    expect(promiseFetchMock).toHaveBeenCalledTimes(2)
    expect(defaultErrorHandler).toHaveBeenCalledTimes(2)
  })

  test('getURL callback/promise error flow matches legacy order', async () => {
    const defaultErrorHandler = vi.fn()
    configureCompat(defaultErrorHandler)

    const callbackFetchMock = stubFetchResponses(
      toJsonResponse(createTokenResponseBody()),
      toJsonResponse({ code: -12345, message: 'Bad request' }, 400),
    )
    const callbackError = vi.fn()

    await new Promise<void>((resolve) => {
      compat.TaxinvoiceService().getURL(
        '1234567890',
        'TBOX',
        () => resolve(),
        (error: unknown) => {
          callbackError(error)
          resolve()
        },
      )
    })

    expect(callbackFetchMock).toHaveBeenCalledTimes(2)
    expect(callbackError).toHaveBeenCalledTimes(1)
    expect(callbackError).toHaveBeenCalledWith(expect.objectContaining({
      code: -12345,
      stage: 'request_api',
    }))
    expect(defaultErrorHandler).not.toHaveBeenCalled()

    const promiseFetchMock = stubFetchResponses(
      toJsonResponse(createTokenResponseBody()),
      toJsonResponse({ code: -22345, message: 'Promise bad request' }, 400),
    )

    await expect(
      promiseCompat.TaxinvoiceService().getURL('1234567890', 'SBOX'),
    ).rejects.toMatchObject({
      code: -22345,
      stage: 'request_api',
    })

    expect(promiseFetchMock).toHaveBeenCalledTimes(2)
    expect(defaultErrorHandler).toHaveBeenCalledTimes(1)
  })
})
