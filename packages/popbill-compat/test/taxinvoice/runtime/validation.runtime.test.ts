import { compat, configureCompat, promiseCompat } from './helpers'

describe('taxinvoice runtime: validation', () => {
  beforeEach(() => {
    configureCompat()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  test('validation errors block network for callback and promise', async () => {
    const fetchMock = vi.fn()
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
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    // @ts-expect-error runtime validation case for non-TS caller
    const emptyTogo: import('@connextable/popbill-spec').TaxInvoiceGetUrlTogo = ''
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
    const invalidTogo: import('@connextable/popbill-spec').TaxInvoiceGetUrlTogo = 'INVALID'
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
})
