import type { TaxInvoiceIssueApiResponse } from '@connextable/popbill-spec'
import {
  asError,
  compat,
  configureCompat,
  createTokenResponseBody,
  getTaxinvoiceRequestInit,
  expectTaxinvoiceRequestPath,
  promiseCompat,
  stubFetchResponses,
  toJsonResponse,
} from './helpers'

describe('taxinvoice runtime: issue', () => {
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
    const fetchMock = stubFetchResponses(toJsonResponse(createTokenResponseBody()), toJsonResponse(issueResponse))
    const service = compat.TaxinvoiceService()

    const resolved = await new Promise<TaxInvoiceIssueApiResponse>((resolve, reject) => {
      service.issue(
        '1234567890',
        'SELL',
        'MGT-001',
        (response: TaxInvoiceIssueApiResponse) => {
          resolve(response)
        },
        (error: unknown) => {
          reject(asError(error))
        }
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
    const fetchMock = stubFetchResponses(toJsonResponse(createTokenResponseBody()), toJsonResponse(issueResponse))
    const service = compat.TaxinvoiceService()

    await new Promise<void>((resolve, reject) => {
      service.issue(
        '1234567890',
        'SELL',
        'MGT-002',
        '발행메모',
        'test-user',
        () => {
          resolve()
        },
        (error: unknown) => {
          reject(asError(error))
        }
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
    const fetchMock = stubFetchResponses(toJsonResponse(createTokenResponseBody()), toJsonResponse(issueResponse))
    const service = compat.TaxinvoiceService()

    await new Promise<void>((resolve, reject) => {
      service.issue(
        '1234567890',
        'SELL',
        'MGT-003',
        '발행메모',
        '안내 메일 제목',
        true,
        'test-user',
        () => {
          resolve()
        },
        (error: unknown) => {
          reject(asError(error))
        }
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
    const fetchMock = stubFetchResponses(toJsonResponse(createTokenResponseBody()), toJsonResponse(issueResponse))

    await promiseCompat.TaxinvoiceService().issue('1234567890', 'SELL', 'MGT-004', '발행메모', 'promise-user')

    const requestInit = getTaxinvoiceRequestInit(fetchMock)
    const requestHeaders = requestInit.headers as Record<string, string>
    expect(requestHeaders['x-pb-userid']).toBe('promise-user')
    expect(JSON.parse(requestInit.body as string)).toEqual({
      memo: '발행메모',
      forceIssue: false,
    })
  })

  test('registIssue callback maps legacy optional arguments to ISSUE request body', async () => {
    const issueResponse = {
      code: 1,
      message: 'issued',
      ntsConfirmNum: '20260225-0900',
    }
    const fetchMock = stubFetchResponses(toJsonResponse(createTokenResponseBody()), toJsonResponse(issueResponse))

    await new Promise<void>((resolve, reject) => {
      compat.TaxinvoiceService().registIssue(
        '1234567890',
        { issueType: '정발행' } as never,
        true,
        true,
        '즉시발행 메모',
        '안내 제목',
        'DEAL-001',
        'regist-user',
        () => {
          resolve()
        },
        (error: unknown) => {
          reject(asError(error))
        }
      )
    })

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expectTaxinvoiceRequestPath(fetchMock, '/Taxinvoice')

    const requestInit = getTaxinvoiceRequestInit(fetchMock)
    const requestHeaders = requestInit.headers as Record<string, string>
    expect(requestHeaders['X-HTTP-Method-Override']).toBe('ISSUE')
    expect(requestHeaders['x-pb-userid']).toBe('regist-user')
    expect(JSON.parse(requestInit.body as string)).toMatchObject({
      issueType: '정발행',
      writeSpecification: true,
      forceIssue: true,
      memo: '즉시발행 메모',
      emailSubject: '안내 제목',
      dealInvoiceMgtKey: 'DEAL-001',
    })
  })
})
