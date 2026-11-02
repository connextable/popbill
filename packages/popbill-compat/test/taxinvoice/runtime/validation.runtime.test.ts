import {
  compat,
  configureCompat,
  promiseCompat,
  stubFetchResponses,
  toJsonResponse,
  createTokenResponseBody,
  getTaxinvoiceRequestInit,
} from './helpers'
import type * as Spec from '@connextable/popbill-spec'

describe('taxinvoice runtime: validation', () => {
  beforeEach(() => {
    configureCompat()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  test('validation errors block network for callback and promise', async () => {
    const fetchMock = vi.fn<typeof fetch>()
    vi.stubGlobal('fetch', fetchMock)

    const callbackError = await new Promise<unknown>((resolve) => {
      compat.TaxinvoiceService().getViewURL(
        '',
        'SELL',
        'MGT-005',
        () => {
          resolve(new Error('unexpected success'))
        },
        (error: unknown) => {
          resolve(error)
        }
      )
    })

    expect(callbackError).toMatchObject({
      code: -99999999,
      message: '팝빌회원 사업자번호가 입력되지 않았습니다.',
    })

    await expect(promiseCompat.TaxinvoiceService().getMassPrintURL('1234567890', 'SELL', [])).rejects.toMatchObject({
      code: -99999999,
      message: '문서번호배열이 입력되지 않았습니다.',
    })

    expect(fetchMock).not.toHaveBeenCalled()
  })

  test('getURL validates TOGO and blocks network', async () => {
    const fetchMock = vi.fn<typeof fetch>()
    vi.stubGlobal('fetch', fetchMock)

    // @ts-expect-error runtime validation case for non-TS caller
    const emptyTogo: Spec.TaxInvoiceGetUrlTogo = ''
    const missingTogoError = await new Promise<unknown>((resolve) => {
      compat.TaxinvoiceService().getURL(
        '1234567890',
        emptyTogo,
        () => {
          resolve(new Error('unexpected success'))
        },
        (error: unknown) => {
          resolve(error)
        }
      )
    })

    expect(missingTogoError).toMatchObject({
      code: -99999999,
      message: '접근 메뉴가 입력되지 않았습니다.',
    })

    // @ts-expect-error runtime validation case for non-TS caller
    const invalidTogo: Spec.TaxInvoiceGetUrlTogo = 'INVALID'
    const invalidTogoError = await new Promise<unknown>((resolve) => {
      compat.TaxinvoiceService().getURL(
        '1234567890',
        invalidTogo,
        () => {
          resolve(new Error('unexpected success'))
        },
        (error: unknown) => {
          resolve(error)
        }
      )
    })

    expect(invalidTogoError).toMatchObject({
      code: -99999999,
      message: '접근 메뉴가 올바르지 않습니다.',
    })

    await expect(promiseCompat.TaxinvoiceService().getURL('1234567890', invalidTogo)).rejects.toMatchObject({
      code: -99999999,
      message: '접근 메뉴가 올바르지 않습니다.',
    })

    expect(fetchMock).not.toHaveBeenCalled()
  })

  test('issue mutations reject BUY key type before network', async () => {
    const fetchMock = vi.fn<typeof fetch>()
    vi.stubGlobal('fetch', fetchMock)

    await expect(
      promiseCompat.TaxinvoiceService().update('1234567890', 'BUY' as never, 'MGT-001', { issueType: '정발행' } as never)
    ).rejects.toMatchObject({
      code: -99999999,
      message: '문서번호유형이 올바르지 않습니다.',
    })

    await expect(promiseCompat.TaxinvoiceService().issue('1234567890', 'BUY' as never, 'MGT-001', 'memo')).rejects.toMatchObject({
      code: -99999999,
      message: '문서번호유형이 올바르지 않습니다.',
    })

    await expect(promiseCompat.TaxinvoiceService().cancelIssue('1234567890', 'BUY' as never, 'MGT-001', 'memo')).rejects.toMatchObject({
      code: -99999999,
      message: '문서번호유형이 올바르지 않습니다.',
    })

    expect(fetchMock).not.toHaveBeenCalled()
  })

  test('required management key rejects missing runtime value before network', async () => {
    const fetchMock = vi.fn<typeof fetch>()
    vi.stubGlobal('fetch', fetchMock)

    await expect(
      promiseCompat.TaxinvoiceService().issue('1234567890', 'SELL', undefined as unknown as Spec.TaxInvoiceMgtKeyType, 'memo')
    ).rejects.toMatchObject({
      code: -99999999,
      message: '문서번호가 입력되지 않았습니다.',
    })

    expect(fetchMock).not.toHaveBeenCalled()
  })

  test('bulk submit validates submit id and batch shape before network', async () => {
    const fetchMock = vi.fn<typeof fetch>()
    vi.stubGlobal('fetch', fetchMock)

    await expect(promiseCompat.TaxinvoiceService().getBulkResult('1234567890', 'SUBMIT/001')).rejects.toMatchObject({
      code: -99999999,
      message: '제출아이디가 올바르지 않습니다.',
    })

    await expect(promiseCompat.TaxinvoiceService().bulkSubmit('1234567890', 'SUBMIT-001', [])).rejects.toMatchObject({ code: -99999999 })

    await expect(
      promiseCompat.TaxinvoiceService().bulkSubmit('1234567890', 'SUBMIT-002', { issueType: '정발행' } as unknown as Spec.TaxInvoiceApiModel[])
    ).rejects.toMatchObject({
      code: -99999999,
      message: '세금계산서 정보가 입력되지 않았습니다.',
    })

    expect(fetchMock).not.toHaveBeenCalled()
  })

  test('forwards batch sizes beyond the current provider limit without splitting', async () => {
    const fetchMock = stubFetchResponses(toJsonResponse(createTokenResponseBody()), toJsonResponse({ code: 1, message: 'accepted' }))
    const invoices = Array.from({ length: 101 }, () => ({ issueType: '정발행' as const }))

    await promiseCompat.TaxinvoiceService().bulkSubmit('1234567890', 'SUBMIT-101', invoices)

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(JSON.parse(getTaxinvoiceRequestInit(fetchMock).body as string).invoices).toEqual(invoices)
  })

  test('reverse issue mutations reject unsupported key types before network', async () => {
    const fetchMock = vi.fn<typeof fetch>()
    vi.stubGlobal('fetch', fetchMock)

    await expect(promiseCompat.TaxinvoiceService().request('1234567890', 'SELL' as never, 'MGT-001', 'memo')).rejects.toMatchObject({
      code: -99999999,
      message: '문서번호유형이 올바르지 않습니다.',
    })

    await expect(promiseCompat.TaxinvoiceService().cancelRequest('1234567890', 'SELL' as never, 'MGT-001', 'memo')).rejects.toMatchObject({
      code: -99999999,
      message: '문서번호유형이 올바르지 않습니다.',
    })

    await expect(promiseCompat.TaxinvoiceService().refuse('1234567890', 'BUY' as never, 'MGT-001', 'memo')).rejects.toMatchObject({
      code: -99999999,
      message: '문서번호유형이 올바르지 않습니다.',
    })

    expect(fetchMock).not.toHaveBeenCalled()
  })
})
