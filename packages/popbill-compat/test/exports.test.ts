import { afterEach, describe, expect, test, vi } from 'vitest'
import * as compat from '@/index'
import * as promiseCompat from '@/promise/index'
import { createTokenResponseBody, stubFetchResponses, toJsonResponse } from './taxinvoice/runtime/helpers'

describe('compat exports', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  test('preserves legacy constant values', () => {
    expect(compat.MgtKeyType).toMatchObject({ SELL: 'SELL', BUY: 'BUY', TRUSTEE: 'TRUSTEE' })
    expect(compat.MessageType).toMatchObject({ SMS: 'SMS', LMS: 'LMS', MMS: 'MMS' })
    expect(compat.KakaoType).toMatchObject({ ATS: 'ATS', FTS: 'FTS', FMS: 'FMS' })
  })

  test('callback entrypoint requests tax invoice charge information', async () => {
    compat.config(createCompatConfig(true))
    const info = { unitCost: '100', chargeMethod: '종량제', rateSystem: '정액' }
    const fetchMock = stubFetchResponses(toJsonResponse(createTokenResponseBody()), toJsonResponse(info))
    const result = await new Promise((resolve, reject) => compat.TaxinvoiceService().getChargeInfo('1234567890', resolve, reject))
    expect(result).toEqual(info)
    expect(String(fetchMock.mock.calls.at(-1)?.[0])).toContain('/Taxinvoice/ChargeInfo')
  })

  test('callback entrypoint delivers validation failures through the error callback', async () => {
    compat.config(createCompatConfig(true))
    const fetchMock = vi.spyOn(globalThis, 'fetch')
    const onSuccess = vi.fn<() => void>()
    const error = await new Promise((resolve) => compat.TaxinvoiceService().getChargeInfo('', onSuccess, resolve))
    expect(error).toMatchObject({ code: expect.any(Number), message: expect.any(String) })
    expect(onSuccess).not.toHaveBeenCalled()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  test('promise subpath requests tax invoice unit cost as a decimal string', async () => {
    promiseCompat.config(createCompatConfig(true))
    stubFetchResponses(toJsonResponse(createTokenResponseBody()), toJsonResponse({ unitCost: '100.50' }))
    await expect(promiseCompat.TaxinvoiceService().getUnitCost('1234567890')).resolves.toBe('100.50')
  })

  test('callback config refresh invalidates promise singleton services', async () => {
    promiseCompat.config(createCompatConfig(true))
    promiseCompat.TaxinvoiceService()

    compat.config(createCompatConfig(false))
    const fetchMock = stubFetchResponses(toJsonResponse(createTokenResponseBody()), toJsonResponse({ itemKey: 'ITEM-1' }))

    await promiseCompat.TaxinvoiceService().getInfo('1234567890', 'SELL', 'MGT-001')

    const requestUrl = String(fetchMock.mock.calls[0]?.[0])
    expect(requestUrl).toContain('/POPBILL/Token')
    expect(requestUrl).not.toContain('/POPBILL_TEST/Token')
  })

  test('promise config refresh invalidates callback singleton services', async () => {
    compat.config(createCompatConfig(true))
    compat.TaxinvoiceService()

    promiseCompat.config(createCompatConfig(false))
    const fetchMock = stubFetchResponses(toJsonResponse(createTokenResponseBody()), toJsonResponse({ itemKey: 'ITEM-1' }))

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

    const requestUrl = String(fetchMock.mock.calls[0]?.[0])
    expect(requestUrl).toContain('/POPBILL/Token')
    expect(requestUrl).not.toContain('/POPBILL_TEST/Token')
  })
})

function createCompatConfig(isTest: boolean): compat.CompatConfig {
  return {
    LinkID: 'TEST_LINK_ID',
    SecretKey: Buffer.from('secret').toString('base64'),
    IsTest: isTest,
  }
}
