import { describe, expect, test, vi } from 'vitest'
import { createTaxinvoicePromiseService, createTaxinvoiceService, type CompatConfig } from '@/factory/index'

describe('compat factory subpath', () => {
  test.each([
    ['callback', createTaxinvoiceService],
    ['promise', createTaxinvoicePromiseService],
  ] as const)('async %s factory returns the service instance', async (_name, createService) => {
    const service = createService({ LinkID: 'TEST_LINK_ID', SecretKey: Buffer.from('secret').toString('base64') })
    const resolveService = async (): Promise<unknown> => service

    await expect(Promise.resolve(service)).resolves.toBe(service)
    await expect(resolveService()).resolves.toBe(service)
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
