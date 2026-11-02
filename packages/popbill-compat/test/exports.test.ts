import { afterEach, describe, expect, test, vi } from 'vitest'
import * as compat from '@/index'
import * as promiseCompat from '@/promise/index'
import { NotImplementedError } from '@/errors'
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

  test('callback stub calls error callback when provided', () => {
    const onSuccess = vi.fn<() => void>()
    const onError = vi.fn<(error: unknown) => void>()
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
