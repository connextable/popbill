import { describe, expect, expectTypeOf, test } from 'vitest'
import {
  createTaxinvoicePromiseService,
  createTaxinvoiceService,
  type CompatConfig,
  type TaxinvoiceCallbackService,
  type TaxinvoicePromiseService,
} from '@/factory/index'

describe('compat factory subpath', () => {
  test('exports taxinvoice factory functions', () => {
    expect(typeof createTaxinvoiceService).toBe('function')
    expect(typeof createTaxinvoicePromiseService).toBe('function')
  })

  test('creates callback and promise taxinvoice services with typed return values', () => {
    const config: CompatConfig = {
      LinkID: 'TEST_LINK_ID',
      SecretKey: Buffer.from('secret').toString('base64'),
      IsTest: true,
    }

    const callbackService = createTaxinvoiceService(config)
    const promiseService = createTaxinvoicePromiseService(config)

    expectTypeOf(callbackService).toEqualTypeOf<TaxinvoiceCallbackService>()
    expectTypeOf(promiseService).toEqualTypeOf<TaxinvoicePromiseService>()

    expect(typeof callbackService.getInfo).toBe('function')
    expect(typeof promiseService.getInfo).toBe('function')
  })

  test('acceptLanguage allows ko-KR and en-US, and rejects unknown values', () => {
    const baseConfig: CompatConfig = {
      LinkID: 'TEST_LINK_ID',
      SecretKey: Buffer.from('secret').toString('base64'),
      IsTest: true,
    }

    expect(() => {
      createTaxinvoicePromiseService({
        ...baseConfig,
        acceptLanguage: 'en-US',
      })
    }).not.toThrow()

    expect(() => {
      createTaxinvoicePromiseService({
        ...baseConfig,
        acceptLanguage: 'ko-KR',
      })
    }).not.toThrow()

    expect(() => {
      createTaxinvoicePromiseService({
        ...baseConfig,
        acceptLanguage: 'ja-JP',
      })
    }).toThrow(/acceptLanguage/)
  })
})
