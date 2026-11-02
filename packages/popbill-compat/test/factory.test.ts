import { describe, expect, test, vi } from 'vitest'
import {
  createTaxinvoicePromiseService,
  createTaxinvoiceService,
  createCashbillPromiseService,
  createCashbillService,
  createStatementPromiseService,
  createStatementService,
  createHTTaxinvoicePromiseService,
  createHTTaxinvoiceService,
  createHTCashbillPromiseService,
  createHTCashbillService,
  createFaxPromiseService,
  createFaxService,
  type CompatConfig,
} from '@/factory/index'

describe('compat factory subpath', () => {
  test.each([
    ['taxinvoice callback', createTaxinvoiceService],
    ['taxinvoice promise', createTaxinvoicePromiseService],
    ['cashbill callback', createCashbillService],
    ['cashbill promise', createCashbillPromiseService],
    ['statement callback', createStatementService],
    ['statement promise', createStatementPromiseService],
    ['httaxinvoice callback', createHTTaxinvoiceService],
    ['httaxinvoice promise', createHTTaxinvoicePromiseService],
    ['htcashbill callback', createHTCashbillService],
    ['htcashbill promise', createHTCashbillPromiseService],
    ['fax callback', createFaxService],
    ['fax promise', createFaxPromiseService],
  ] as const)('async %s factory returns the service instance', async (_name, createService) => {
    const service = createService({ LinkID: 'TEST_LINK_ID', SecretKey: Buffer.from('secret').toString('base64') })
    const resolveService = async (): Promise<unknown> => service

    expect(Reflect.get(service, 'unregisteredMethod')).toBeUndefined()
    expect(Object.hasOwn(service, 'unregisteredMethod')).toBe(false)
    expect(Reflect.get(service, 'then')).toBeUndefined()
    await expect(Promise.resolve(service)).resolves.toBe(service)
    await expect(resolveService()).resolves.toBe(service)
  })

  test('acceptLanguage leaves language negotiation to the provider', () => {
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
    }).not.toThrow()
  })

  test('factory instances keep their own default error handlers when the config object is reused', async () => {
    const firstErrorHandler = vi.fn<(error: unknown) => void>()
    const secondErrorHandler = vi.fn<(error: unknown) => void>()
    const config: CompatConfig = {
      LinkID: 'TEST_LINK_ID',
      SecretKey: Buffer.from('secret').toString('base64'),
      defaultErrorHandler: firstErrorHandler,
    }
    const firstService = createTaxinvoicePromiseService(config)

    config.defaultErrorHandler = secondErrorHandler
    const secondService = createTaxinvoicePromiseService(config)

    await expect(firstService.getInfo('', 'SELL', 'MGT-001')).rejects.toMatchObject({ code: -99999999 })
    expect(firstErrorHandler).toHaveBeenCalledTimes(1)
    expect(secondErrorHandler).not.toHaveBeenCalled()

    await expect(secondService.getInfo('', 'SELL', 'MGT-002')).rejects.toMatchObject({ code: -99999999 })
    expect(firstErrorHandler).toHaveBeenCalledTimes(1)
    expect(secondErrorHandler).toHaveBeenCalledTimes(1)
  })
})
