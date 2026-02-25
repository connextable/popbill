import { describe, expect, expectTypeOf, test, vi } from 'vitest'
import * as compat from '@/index'
import * as promiseCompat from '@/promise/index'
import { NotImplementedError } from '@/errors'
import type {
  TaxInvoiceGetInfoApiResponse,
  TaxInvoiceIssueApiResponse,
  TaxInvoiceSearchApiResponse,
  TaxInvoiceGetViewUrlApiResponse,
  TaxInvoiceGetTaxCertInfoApiResponse,
} from '@connextable/popbill-spec'

describe('compat exports', () => {
  test('matches legacy export keys at root', () => {
    expect(compat).toMatchObject({
      config: expect.any(Function),
      MgtKeyType: expect.objectContaining({ SELL: 'SELL', BUY: 'BUY', TRUSTEE: 'TRUSTEE' }),
      MessageType: expect.objectContaining({ SMS: 'SMS', LMS: 'LMS', MMS: 'MMS' }),
      KakaoType: expect.objectContaining({ ATS: 'ATS', FTS: 'FTS', FMS: 'FMS' }),
      TaxinvoiceService: expect.any(Function),
      StatementService: expect.any(Function),
      CashbillService: expect.any(Function),
      MessageService: expect.any(Function),
      KakaoService: expect.any(Function),
      FaxService: expect.any(Function),
      HTTaxinvoiceService: expect.any(Function),
      HTCashbillService: expect.any(Function),
      ClosedownService: expect.any(Function),
      BizInfoCheckService: expect.any(Function),
      EasyFinBankService: expect.any(Function),
      AccountCheckService: expect.any(Function),
    })
  })

  test('callback stub calls error callback when provided', () => {
    const onSuccess = vi.fn()
    const onError = vi.fn()
    compat.TaxinvoiceService().getInfo('1234567890', 'SELL', 'MGT-KEY-001', onSuccess, onError)

    expect(onSuccess).not.toHaveBeenCalled()
    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError).toHaveBeenCalledWith(expect.any(NotImplementedError))
  })

  test('callback stub throws when no callback exists', () => {
    expect(() => {
      compat.TaxinvoiceService().getInfo('1234567890', 'SELL', 'MGT-KEY-001')
    }).toThrow(NotImplementedError)
  })

  test('promise subpath returns rejected promise with NotImplementedError', async () => {
    await expect(promiseCompat.TaxinvoiceService().getInfo('1234567890', 'SELL', 'MGT-KEY-001')).rejects.toBeInstanceOf(
      NotImplementedError,
    )
  })

  test('taxinvoice method typing is exposed at callback and promise entrypoints', () => {
    const callbackService = compat.TaxinvoiceService()
    const promiseService = promiseCompat.TaxinvoiceService()

    expectTypeOf(callbackService.getInfo).toBeCallableWith(
      '1234567890',
      'SELL',
      'MGT-KEY-001',
      (response: TaxInvoiceGetInfoApiResponse) => {
        void response
      },
      (error: unknown) => {
        void error
      },
    )
    expectTypeOf(callbackService.issue).toBeCallableWith(
      '1234567890',
      'SELL',
      'MGT-KEY-001',
      'memo',
      'subject',
      true,
      (response: TaxInvoiceIssueApiResponse) => {
        void response
      },
      (error: unknown) => {
        void error
      },
    )
    expectTypeOf(callbackService.search).toBeCallableWith(
      '1234567890',
      'SELL',
      'W',
      '20260101',
      '20260131',
      ['3**'],
      ['N'],
      ['과세'],
      null,
      'D',
      1,
      100,
      (response: TaxInvoiceSearchApiResponse) => {
        void response
      },
    )
    expectTypeOf(callbackService.getViewURL).toBeCallableWith(
      '1234567890',
      'SELL',
      'MGT-KEY-001',
      (response: TaxInvoiceGetViewUrlApiResponse) => {
        void response
      },
      (error: unknown) => {
        void error
      },
    )
    expectTypeOf(callbackService.getTaxCertInfo).toBeCallableWith(
      '1234567890',
      (response: TaxInvoiceGetTaxCertInfoApiResponse) => {
        void response
      },
      (error: unknown) => {
        void error
      },
    )

    expectTypeOf(promiseService.getInfo).returns.toEqualTypeOf<Promise<TaxInvoiceGetInfoApiResponse>>()
    expectTypeOf(promiseService.issue).returns.toEqualTypeOf<Promise<TaxInvoiceIssueApiResponse>>()
    expectTypeOf(promiseService.search).returns.toEqualTypeOf<Promise<TaxInvoiceSearchApiResponse>>()
    expectTypeOf(promiseService.getViewURL).returns.toEqualTypeOf<Promise<TaxInvoiceGetViewUrlApiResponse>>()
    expectTypeOf(promiseService.getTaxCertInfo).returns.toEqualTypeOf<Promise<TaxInvoiceGetTaxCertInfoApiResponse>>()
  })
})
