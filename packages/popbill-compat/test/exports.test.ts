import { describe, expect, expectTypeOf, test, vi } from 'vitest'
import * as compat from '@/index'
import * as promiseCompat from '@/promise/index'
import { NotImplementedError } from '@/errors'
import type { TaxinvoicePromiseService } from '@/services/taxinvoice/types'
import type * as Spec from '@connextable/popbill-spec'

describe('compat exports', () => {
  test('matches legacy export keys at root', () => {
    expect(typeof compat.config).toBe('function')
    expect(compat.MgtKeyType).toMatchObject({ SELL: 'SELL', BUY: 'BUY', TRUSTEE: 'TRUSTEE' })
    expect(compat.MessageType).toMatchObject({ SMS: 'SMS', LMS: 'LMS', MMS: 'MMS' })
    expect(compat.KakaoType).toMatchObject({ ATS: 'ATS', FTS: 'FTS', FMS: 'FMS' })
    expect(typeof compat.TaxinvoiceService).toBe('function')
    expect(typeof compat.StatementService).toBe('function')
    expect(typeof compat.CashbillService).toBe('function')
    expect(typeof compat.MessageService).toBe('function')
    expect(typeof compat.KakaoService).toBe('function')
    expect(typeof compat.FaxService).toBe('function')
    expect(typeof compat.HTTaxinvoiceService).toBe('function')
    expect(typeof compat.HTCashbillService).toBe('function')
    expect(typeof compat.ClosedownService).toBe('function')
    expect(typeof compat.BizInfoCheckService).toBe('function')
    expect(typeof compat.EasyFinBankService).toBe('function')
    expect(typeof compat.AccountCheckService).toBe('function')
  })

  test('callback stub calls error callback when provided', () => {
    const onSuccess = vi.fn()
    const onError = vi.fn()
    compat.TaxinvoiceService().getChargeInfo('1234567890', onSuccess, onError)

    expect(onSuccess).not.toHaveBeenCalled()
    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError).toHaveBeenCalledWith(expect.any(NotImplementedError))
  })

  test('callback stub throws when no callback exists', () => {
    expect(() => {
      compat.TaxinvoiceService().getChargeInfo('1234567890')
    }).toThrow(NotImplementedError)
  })

  test('promise subpath returns rejected promise with NotImplementedError', async () => {
    await expect(promiseCompat.TaxinvoiceService().getChargeInfo('1234567890')).rejects.toBeInstanceOf(NotImplementedError)
  })

  test('callback config refresh invalidates promise singleton services', async () => {
    promiseCompat.config(createCompatConfig(true))
    promiseCompat.TaxinvoiceService()

    compat.config(createCompatConfig(false))
    const fetchMock = stubFetchResponses(createTokenResponseBody(), { itemKey: 'ITEM-1' })

    await promiseCompat.TaxinvoiceService().getInfo('1234567890', 'SELL', 'MGT-001')

    expect(String(fetchMock.mock.calls[0]?.[0])).toContain('/POPBILL/Token')
    expect(String(fetchMock.mock.calls[0]?.[0])).not.toContain('/POPBILL_TEST/Token')
  })

  test('promise config refresh invalidates callback singleton services', async () => {
    compat.config(createCompatConfig(true))
    compat.TaxinvoiceService()

    promiseCompat.config(createCompatConfig(false))
    const fetchMock = stubFetchResponses(createTokenResponseBody(), { itemKey: 'ITEM-1' })

    await new Promise<void>((resolve, reject) => {
      compat.TaxinvoiceService().getInfo(
        '1234567890',
        'SELL',
        'MGT-001',
        () => {
          resolve()
        },
        (error: unknown) => {
          reject(error instanceof Error ? error : new Error(String(error)))
        }
      )
    })

    expect(String(fetchMock.mock.calls[0]?.[0])).toContain('/POPBILL/Token')
    expect(String(fetchMock.mock.calls[0]?.[0])).not.toContain('/POPBILL_TEST/Token')
  })

  test('taxinvoice method typing is exposed at callback and promise entrypoints', () => {
    const callbackService = compat.TaxinvoiceService()

    expectTypeOf(callbackService.getInfo).toBeCallableWith(
      '1234567890',
      'SELL',
      'MGT-KEY-001',
      (response: Spec.TaxInvoiceGetInfoApiResponse) => {
        void response
      },
      (error: unknown) => {
        void error
      }
    )
    expectTypeOf(callbackService.issue).toBeCallableWith(
      '1234567890',
      'SELL',
      'MGT-KEY-001',
      'memo',
      'subject',
      true,
      (response: Spec.TaxInvoiceIssueApiResponse) => {
        void response
      },
      (error: unknown) => {
        void error
      }
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
      (response: Spec.TaxInvoiceSearchApiResponse) => {
        void response
      }
    )
    expectTypeOf(callbackService.getViewURL).toBeCallableWith(
      '1234567890',
      'SELL',
      'MGT-KEY-001',
      (response: string) => {
        void response
      },
      (error: unknown) => {
        void error
      }
    )
    expectTypeOf(callbackService.getURL).toBeCallableWith(
      '1234567890',
      'TBOX',
      (response: string) => {
        void response
      },
      (error: unknown) => {
        void error
      }
    )
    expectTypeOf(callbackService.getTaxCertInfo).toBeCallableWith(
      '1234567890',
      (response: Spec.TaxInvoiceGetTaxCertInfoApiResponse) => {
        void response
      },
      (error: unknown) => {
        void error
      }
    )

    expectTypeOf<TaxinvoicePromiseService['getInfo']>().returns.toEqualTypeOf<Promise<Spec.TaxInvoiceGetInfoApiResponse>>()
    expectTypeOf<TaxinvoicePromiseService['issue']>().returns.toEqualTypeOf<Promise<Spec.TaxInvoiceIssueApiResponse>>()
    expectTypeOf<TaxinvoicePromiseService['search']>().returns.toEqualTypeOf<Promise<Spec.TaxInvoiceSearchApiResponse>>()
    expectTypeOf<TaxinvoicePromiseService['getViewURL']>().returns.toEqualTypeOf<Promise<string>>()
    expectTypeOf<TaxinvoicePromiseService['getURL']>().returns.toEqualTypeOf<Promise<string>>()
    expectTypeOf<TaxinvoicePromiseService['getTaxCertInfo']>().returns.toEqualTypeOf<Promise<Spec.TaxInvoiceGetTaxCertInfoApiResponse>>()
  })
})

function createCompatConfig(isTest: boolean): compat.CompatConfig {
  return {
    LinkID: 'TEST_LINK_ID',
    SecretKey: Buffer.from('secret').toString('base64'),
    IsTest: isTest,
  }
}

function createTokenResponseBody() {
  return {
    session_token: 'session-token',
    expiration: '2099-01-01T00:00:00Z',
    serviceID: 'POPBILL',
  }
}

function stubFetchResponses(...bodies: unknown[]): ReturnType<typeof vi.fn> {
  const fetchMock = vi.fn()

  for (const body of bodies) {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify(body), {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
      })
    )
  }

  vi.stubGlobal('fetch', fetchMock)

  return fetchMock
}
