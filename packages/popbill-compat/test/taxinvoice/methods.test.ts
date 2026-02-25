import * as compat from '@/index'
import * as promiseCompat from '@/promise/index'
import { NotImplementedError } from '@/errors'
import {
  TAXINVOICE_REQUIRED_METHODS,
} from '@/services/taxinvoice/methods'

describe('taxinvoice legacy method surface', () => {
  test('required 46 methods exist in callback and promise services', () => {
    const callbackService = compat.TaxinvoiceService()
    const promiseService = promiseCompat.TaxinvoiceService()
    const requiredMethods = TAXINVOICE_REQUIRED_METHODS

    for (const methodName of requiredMethods) {
      expect(typeof callbackService[methodName]).toBe('function')
      expect(typeof promiseService[methodName]).toBe('function')
    }

    expect(TAXINVOICE_REQUIRED_METHODS).toHaveLength(46)
  })

  test('extra compatibility methods remain available', () => {
    const callbackService = compat.TaxinvoiceService()
    const promiseService = promiseCompat.TaxinvoiceService()

    expect(typeof callbackService.send).toBe('function')
    expect(typeof callbackService.cancelSend).toBe('function')
    expect(typeof promiseService.send).toBe('function')
    expect(typeof promiseService.cancelSend).toBe('function')
  })

  test('non-legacy helper names are not exposed on service surface', () => {
    const callbackService = compat.TaxinvoiceService()
    const promiseService = promiseCompat.TaxinvoiceService()

    expect(callbackService).not.toHaveProperty('requestIssue')
    expect(promiseService).not.toHaveProperty('requestIssue')
  })

  test('non-required compatibility method remains stubbed for callback and promise', async () => {
    const onSuccess = vi.fn()
    const onError = vi.fn()

    compat.TaxinvoiceService().getChargeInfo('1234567890', onSuccess, onError)

    expect(onSuccess).not.toHaveBeenCalled()
    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError).toHaveBeenCalledWith(expect.any(NotImplementedError))

    await expect(
      promiseCompat.TaxinvoiceService().getChargeInfo('1234567890'),
    ).rejects.toBeInstanceOf(NotImplementedError)
  })
})
