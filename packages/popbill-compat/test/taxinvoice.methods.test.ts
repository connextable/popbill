import { describe, expect, test } from 'vitest'
import * as compat from '@/index'
import * as promiseCompat from '@/promise/index'
import {
  TAXINVOICE_REQUIRED_METHODS,
} from '@/services/taxinvoice/methods'

describe('taxinvoice legacy method surface', () => {
  test('required 46 methods exist in callback and promise services', () => {
    const callbackService = compat.TaxinvoiceService() as unknown as Record<string, unknown>
    const promiseService = promiseCompat.TaxinvoiceService() as unknown as Record<string, unknown>

    for (const methodName of TAXINVOICE_REQUIRED_METHODS) {
      expect(typeof callbackService[methodName]).toBe('function')
      expect(typeof promiseService[methodName]).toBe('function')
    }

    expect(TAXINVOICE_REQUIRED_METHODS).toHaveLength(46)
  })

  test('extra compatibility methods remain available', () => {
    const callbackService = compat.TaxinvoiceService() as unknown as Record<string, unknown>
    const promiseService = promiseCompat.TaxinvoiceService() as unknown as Record<string, unknown>

    expect(typeof callbackService['send']).toBe('function')
    expect(typeof callbackService['cancelSend']).toBe('function')
    expect(typeof promiseService['send']).toBe('function')
    expect(typeof promiseService['cancelSend']).toBe('function')
  })

  test('non-legacy helper names are not exposed on service surface', () => {
    const callbackService = compat.TaxinvoiceService() as unknown as Record<string, unknown>
    const promiseService = promiseCompat.TaxinvoiceService() as unknown as Record<string, unknown>

    expect(callbackService).not.toHaveProperty('requestIssue')
    expect(promiseService).not.toHaveProperty('requestIssue')
  })
})
