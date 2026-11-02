import * as helpers from './helpers'
import type * as Spec from '@connextable/popbill-spec'

describe('taxinvoice runtime: issue', () => {
  beforeEach(() => {
    helpers.configureCompat()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  test('callback issue supports legacy overload without memo', async () => {
    const issueResponse: Spec.TaxInvoiceIssueApiResponse = {
      code: 1,
      message: 'issued',
      ntsConfirmNum: '20260225-0001',
    }
    const fetchMock = helpers.stubFetchResponses(helpers.toJsonResponse(helpers.createTokenResponseBody()), helpers.toJsonResponse(issueResponse))
    const service = helpers.compat.TaxinvoiceService()

    const resolved = await new Promise<Spec.TaxInvoiceIssueApiResponse>((resolve, reject) => {
      service.issue(
        '1234567890',
        'SELL',
        'MGT-001',
        (response: Spec.TaxInvoiceIssueApiResponse) => {
          resolve(response)
        },
        (error: unknown) => {
          reject(helpers.asError(error))
        }
      )
    })

    expect(resolved).toMatchObject(issueResponse)
    expect(fetchMock).toHaveBeenCalledTimes(2)
    helpers.expectTaxinvoiceRequestPath(fetchMock, '/Taxinvoice/SELL/MGT-001')

    const requestInit = helpers.getTaxinvoiceRequestInit(fetchMock)
    const requestHeaders = requestInit.headers as Record<string, string>
    expect(requestHeaders['X-HTTP-Method-Override']).toBe('ISSUE')
    expect(requestHeaders).not.toHaveProperty('x-pb-userid')
    expect(requestInit.body).toBe('{"forceIssue":false}')
  })

  test('callback issue prioritizes single optional string as userId', async () => {
    const issueResponse: Spec.TaxInvoiceIssueApiResponse = {
      code: 1,
      message: 'issued',
    }
    const fetchMock = helpers.stubFetchResponses(helpers.toJsonResponse(helpers.createTokenResponseBody()), helpers.toJsonResponse(issueResponse))
    const service = helpers.compat.TaxinvoiceService()

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
          reject(helpers.asError(error))
        }
      )
    })

    const requestInit = helpers.getTaxinvoiceRequestInit(fetchMock)
    const requestHeaders = requestInit.headers as Record<string, string>
    expect(requestHeaders['x-pb-userid']).toBe('test-user')
    expect(JSON.parse(requestInit.body as string)).toEqual({
      memo: '발행메모',
      forceIssue: false,
    })
  })

  test('callback issue preserves memo with success callback', async () => {
    const issueResponse: Spec.TaxInvoiceIssueApiResponse = {
      code: 1,
      message: 'issued',
    }
    const fetchMock = helpers.stubFetchResponses(helpers.toJsonResponse(helpers.createTokenResponseBody()), helpers.toJsonResponse(issueResponse))
    const service = helpers.compat.TaxinvoiceService()

    await new Promise<void>((resolve, reject) => {
      service.issue(
        '1234567890',
        'SELL',
        'MGT-MEMO',
        '발행메모',
        () => {
          resolve()
        },
        (error: unknown) => {
          reject(helpers.asError(error))
        }
      )
    })

    const requestInit = helpers.getTaxinvoiceRequestInit(fetchMock)
    const requestHeaders = requestInit.headers as Record<string, string>
    expect(requestHeaders).not.toHaveProperty('x-pb-userid')
    expect(JSON.parse(requestInit.body as string)).toEqual({
      memo: '발행메모',
      forceIssue: false,
    })
  })

  test('callback issue supports full argument shape with emailSubject and forceIssue', async () => {
    const issueResponse: Spec.TaxInvoiceIssueApiResponse = {
      code: 1,
      message: 'issued',
    }
    const fetchMock = helpers.stubFetchResponses(helpers.toJsonResponse(helpers.createTokenResponseBody()), helpers.toJsonResponse(issueResponse))
    const service = helpers.compat.TaxinvoiceService()

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
          reject(helpers.asError(error))
        }
      )
    })

    const requestInit = helpers.getTaxinvoiceRequestInit(fetchMock)
    const requestHeaders = requestInit.headers as Record<string, string>
    expect(requestHeaders['x-pb-userid']).toBe('test-user')
    expect(JSON.parse(requestInit.body as string)).toEqual({
      memo: '발행메모',
      emailSubject: '안내 메일 제목',
      forceIssue: true,
    })
  })

  test('callback issue preserves later slots when emailSubject is omitted', async () => {
    const issueResponse: Spec.TaxInvoiceIssueApiResponse = {
      code: 1,
      message: 'issued',
    }
    const fetchMock = helpers.stubFetchResponses(helpers.toJsonResponse(helpers.createTokenResponseBody()), helpers.toJsonResponse(issueResponse))
    const service = helpers.compat.TaxinvoiceService()

    await new Promise<void>((resolve, reject) => {
      service.issue(
        '1234567890',
        'SELL',
        'MGT-OMIT',
        '발행메모',
        undefined as unknown as string,
        true,
        'test-user',
        () => {
          resolve()
        },
        (error: unknown) => {
          reject(helpers.asError(error))
        }
      )
    })

    const requestInit = helpers.getTaxinvoiceRequestInit(fetchMock)
    const requestHeaders = requestInit.headers as Record<string, string>
    expect(requestHeaders['x-pb-userid']).toBe('test-user')
    expect(JSON.parse(requestInit.body as string)).toEqual({
      memo: '발행메모',
      forceIssue: true,
    })
  })

  test('promise issue treats single optional string as userId', async () => {
    const issueResponse: Spec.TaxInvoiceIssueApiResponse = {
      code: 1,
      message: 'issued',
    }
    const fetchMock = helpers.stubFetchResponses(helpers.toJsonResponse(helpers.createTokenResponseBody()), helpers.toJsonResponse(issueResponse))

    await helpers.promiseCompat.TaxinvoiceService().issue('1234567890', 'SELL', 'MGT-004', '발행메모', 'promise-user')

    const requestInit = helpers.getTaxinvoiceRequestInit(fetchMock)
    const requestHeaders = requestInit.headers as Record<string, string>
    expect(requestHeaders['x-pb-userid']).toBe('promise-user')
    expect(JSON.parse(requestInit.body as string)).toEqual({
      memo: '발행메모',
      forceIssue: false,
    })
  })

  test('callback issue retains the title and later fields when Memo is defaulted', async () => {
    const fetchMock = helpers.stubFetchResponses(
      helpers.toJsonResponse(helpers.createTokenResponseBody()),
      helpers.toJsonResponse({ code: 1, message: 'issued' })
    )
    await new Promise<unknown>((resolve, reject) =>
      helpers.compat.TaxinvoiceService().issue('1234567890', 'SELL', 'MGT-NO-MEMO', undefined, 'subject', true, 'user', resolve, reject)
    )
    const init = helpers.getTaxinvoiceRequestInit(fetchMock)
    expect(JSON.parse(init.body as string)).toEqual({ emailSubject: 'subject', forceIssue: true })
    expect((init.headers as Record<string, string>)['x-pb-userid']).toBe('user')
  })

  test.each([
    { name: 'no optional values', values: [], body: { forceIssue: false }, userId: undefined },
    { name: 'memo', values: ['memo'], body: { memo: 'memo', forceIssue: false }, userId: undefined },
    { name: 'memo and user', values: ['memo', 'user'], body: { memo: 'memo', forceIssue: false }, userId: 'user' },
    { name: 'memo, force and user', values: ['memo', true, 'user'], body: { memo: 'memo', forceIssue: true }, userId: 'user' },
    {
      name: 'all values',
      values: ['memo', 'subject', true, 'user'],
      body: { memo: 'memo', emailSubject: 'subject', forceIssue: true },
      userId: 'user',
    },
    { name: 'default memo', values: [undefined, 'subject', true, 'user'], body: { emailSubject: 'subject', forceIssue: true }, userId: 'user' },
    { name: 'default subject', values: ['memo', undefined, true, 'user'], body: { memo: 'memo', forceIssue: true }, userId: 'user' },
    { name: 'default memo and subject', values: [undefined, undefined, true, 'user'], body: { forceIssue: true }, userId: 'user' },
    {
      name: 'default force and user',
      values: ['memo', 'subject', undefined, undefined],
      body: { memo: 'memo', emailSubject: 'subject', forceIssue: false },
      userId: undefined,
    },
    {
      name: 'title and user shorthand',
      values: [undefined, 'subject', 'user'],
      body: { emailSubject: 'subject', forceIssue: false },
      userId: 'user',
    },
  ])('callback issue preserves $name before the two callback slots', async ({ values, body, userId }) => {
    const fetchMock = helpers.stubFetchResponses(
      helpers.toJsonResponse(helpers.createTokenResponseBody()),
      helpers.toJsonResponse({ code: 1, message: 'issued' })
    )
    await new Promise<unknown>((resolve, reject) => {
      const issue = helpers.compat.TaxinvoiceService().issue as (...args: unknown[]) => void
      issue('1234567890', 'SELL', 'MGT-SLOTS', ...values, resolve, reject)
    })
    const init = helpers.getTaxinvoiceRequestInit(fetchMock)
    expect(JSON.parse(init.body as string)).toEqual(body)
    expect((init.headers as Record<string, string>)['x-pb-userid']).toBe(userId)
  })

  test('promise issue preserves forceIssue and userId when emailSubject is omitted', async () => {
    const issueResponse: Spec.TaxInvoiceIssueApiResponse = {
      code: 1,
      message: 'issued',
    }
    const fetchMock = helpers.stubFetchResponses(helpers.toJsonResponse(helpers.createTokenResponseBody()), helpers.toJsonResponse(issueResponse))

    await helpers.promiseCompat.TaxinvoiceService().issue('1234567890', 'SELL', 'MGT-005', '발행메모', undefined, true, 'promise-user')

    const requestInit = helpers.getTaxinvoiceRequestInit(fetchMock)
    const requestHeaders = requestInit.headers as Record<string, string>
    expect(requestHeaders['x-pb-userid']).toBe('promise-user')
    expect(JSON.parse(requestInit.body as string)).toEqual({
      memo: '발행메모',
      forceIssue: true,
    })
  })

  test('promise issue encodes management key path segment', async () => {
    const issueResponse: Spec.TaxInvoiceIssueApiResponse = {
      code: 1,
      message: 'issued',
    }
    const fetchMock = helpers.stubFetchResponses(helpers.toJsonResponse(helpers.createTokenResponseBody()), helpers.toJsonResponse(issueResponse))

    await helpers.promiseCompat.TaxinvoiceService().issue('1234567890', 'SELL', 'MGT/006?x', '발행메모', 'promise-user')

    helpers.expectTaxinvoiceRequestPath(fetchMock, '/Taxinvoice/SELL/MGT%2F006%3Fx')
  })

  test('registIssue callback maps legacy optional arguments to ISSUE request body', async () => {
    const issueResponse = {
      code: 1,
      message: 'issued',
      ntsConfirmNum: '20260225-0900',
    }
    const fetchMock = helpers.stubFetchResponses(helpers.toJsonResponse(helpers.createTokenResponseBody()), helpers.toJsonResponse(issueResponse))

    await new Promise<void>((resolve, reject) => {
      helpers.compat.TaxinvoiceService().registIssue(
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
          reject(helpers.asError(error))
        }
      )
    })

    expect(fetchMock).toHaveBeenCalledTimes(2)
    helpers.expectTaxinvoiceRequestPath(fetchMock, '/Taxinvoice')

    const requestInit = helpers.getTaxinvoiceRequestInit(fetchMock)
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

  test('promise registIssue preserves later options when earlier optional slots are omitted', async () => {
    const issueResponse = {
      code: 1,
      message: 'issued',
    }
    const fetchMock = helpers.stubFetchResponses(helpers.toJsonResponse(helpers.createTokenResponseBody()), helpers.toJsonResponse(issueResponse))

    await helpers.promiseCompat
      .TaxinvoiceService()
      .registIssue('1234567890', { issueType: '정발행' } as never, undefined, true, undefined, '안내 제목', undefined, 'regist-user')

    const requestInit = helpers.getTaxinvoiceRequestInit(fetchMock)
    const requestHeaders = requestInit.headers as Record<string, string>
    expect(requestHeaders['x-pb-userid']).toBe('regist-user')
    expect(JSON.parse(requestInit.body as string)).toMatchObject({
      issueType: '정발행',
      forceIssue: true,
      emailSubject: '안내 제목',
    })
  })

  test('promise bulkSubmit preserves userId when forceIssue is omitted', async () => {
    const bulkResponse = {
      code: 1,
      message: 'submitted',
      receiptID: 'RID-1',
    }
    const fetchMock = helpers.stubFetchResponses(helpers.toJsonResponse(helpers.createTokenResponseBody()), helpers.toJsonResponse(bulkResponse))

    await helpers.promiseCompat.TaxinvoiceService().bulkSubmit('1234567890', 'SUBMIT-1', [{ issueType: '정발행' } as never], undefined, 'bulk-user')

    const requestInit = helpers.getTaxinvoiceRequestInit(fetchMock)
    const requestHeaders = requestInit.headers as Record<string, string>
    expect(requestHeaders['x-pb-userid']).toBe('bulk-user')
    expect(JSON.parse(requestInit.body as string)).toEqual({
      invoices: [{ issueType: '정발행' }],
    })
  })

  test('callback bulkSubmit preserves callbacks when forceIssue is omitted', async () => {
    const bulkResponse = {
      code: 1,
      message: 'submitted',
      receiptID: 'RID-2',
    }
    const fetchMock = helpers.stubFetchResponses(helpers.toJsonResponse(helpers.createTokenResponseBody()), helpers.toJsonResponse(bulkResponse))

    const resolved = await new Promise<Spec.TaxInvoiceBulkSubmitApiResponse>((resolve, reject) => {
      helpers.compat.TaxinvoiceService().bulkSubmit(
        '1234567890',
        'SUBMIT-2',
        [{ issueType: '정발행' } as never],
        undefined,
        (response: Spec.TaxInvoiceBulkSubmitApiResponse) => {
          resolve(response)
        },
        (error: unknown) => {
          reject(helpers.asError(error))
        }
      )
    })

    expect(resolved).toMatchObject(bulkResponse)
    const requestInit = helpers.getTaxinvoiceRequestInit(fetchMock)
    const requestHeaders = requestInit.headers as Record<string, string>
    expect(requestHeaders).not.toHaveProperty('x-pb-userid')
    expect(JSON.parse(requestInit.body as string)).toEqual({
      invoices: [{ issueType: '정발행' }],
    })
  })
})
