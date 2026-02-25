import { describe, expect, test, vi } from 'vitest'
import * as compat from '@/index'
import * as promiseCompat from '@/promise/index'
import { NotImplementedError } from '@/errors'

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
    ;(compat.TaxinvoiceService() as Record<string, (...args: unknown[]) => unknown>).getInfo('1234567890', onSuccess, onError)

    expect(onSuccess).not.toHaveBeenCalled()
    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError).toHaveBeenCalledWith(expect.any(NotImplementedError))
  })

  test('callback stub throws when no callback exists', () => {
    expect(() => {
      ;(compat.TaxinvoiceService() as Record<string, (...args: unknown[]) => unknown>).getInfo('1234567890')
    }).toThrow(NotImplementedError)
  })

  test('promise subpath returns rejected promise with NotImplementedError', async () => {
    await expect(
      (promiseCompat.TaxinvoiceService() as Record<string, (...args: unknown[]) => Promise<never>>).getInfo('1234567890'),
    ).rejects.toBeInstanceOf(NotImplementedError)
  })
})
