import * as helpers from './helpers'

describe('taxinvoice runtime: error-flow', () => {
  beforeEach(() => {
    helpers.configureCompat()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  test('callback path prefers error callback over defaultErrorHandler', async () => {
    const defaultErrorHandler = vi.fn()
    helpers.configureCompat(defaultErrorHandler)
    const fetchMock = helpers.stubFetchResponses(
      helpers.toJsonResponse(helpers.createTokenResponseBody()),
      helpers.toJsonResponse({ code: -12345, message: 'Bad request' }, 400)
    )
    const callbackError = vi.fn()

    await new Promise<void>((resolve) => {
      helpers.compat.TaxinvoiceService().getViewURL(
        '1234567890',
        'SELL',
        'MGT-ERROR-1',
        () => {
          resolve()
        },
        (error: unknown) => {
          callbackError(error)
          resolve()
        }
      )
    })

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(callbackError).toHaveBeenCalledTimes(1)
    expect(callbackError).toHaveBeenCalledWith(
      expect.objectContaining({
        code: -12345,
        stage: 'request_api',
      })
    )
    expect(defaultErrorHandler).not.toHaveBeenCalled()
  })

  test('callback and promise path use defaultErrorHandler fallback and reject', async () => {
    const defaultErrorHandler = vi.fn()
    helpers.configureCompat(defaultErrorHandler)

    const callbackFetchMock = helpers.stubFetchResponses(
      helpers.toJsonResponse(helpers.createTokenResponseBody()),
      helpers.toJsonResponse({ code: -12345, message: 'Bad request' }, 400)
    )

    helpers.compat.TaxinvoiceService().getViewURL('1234567890', 'SELL', 'MGT-ERROR-2', () => undefined)

    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(defaultErrorHandler).toHaveBeenCalledTimes(1)

    expect(callbackFetchMock).toHaveBeenCalledTimes(2)

    const promiseFetchMock = helpers.stubFetchResponses(
      helpers.toJsonResponse(helpers.createTokenResponseBody()),
      helpers.toJsonResponse({ code: -22345, message: 'Promise bad request' }, 400)
    )

    await expect(helpers.promiseCompat.TaxinvoiceService().getPDFURL('1234567890', 'SELL', 'MGT-ERROR-3')).rejects.toMatchObject({
      code: -22345,
      stage: 'request_api',
    })

    expect(promiseFetchMock).toHaveBeenCalledTimes(2)
    expect(defaultErrorHandler).toHaveBeenCalledTimes(2)
  })

  test('getURL callback/promise error flow matches legacy order', async () => {
    const defaultErrorHandler = vi.fn()
    helpers.configureCompat(defaultErrorHandler)

    const callbackFetchMock = helpers.stubFetchResponses(
      helpers.toJsonResponse(helpers.createTokenResponseBody()),
      helpers.toJsonResponse({ code: -12345, message: 'Bad request' }, 400)
    )
    const callbackError = vi.fn()

    await new Promise<void>((resolve) => {
      helpers.compat.TaxinvoiceService().getURL(
        '1234567890',
        'TBOX',
        () => {
          resolve()
        },
        (error: unknown) => {
          callbackError(error)
          resolve()
        }
      )
    })

    expect(callbackFetchMock).toHaveBeenCalledTimes(2)
    expect(callbackError).toHaveBeenCalledTimes(1)
    expect(callbackError).toHaveBeenCalledWith(
      expect.objectContaining({
        code: -12345,
        stage: 'request_api',
      })
    )
    expect(defaultErrorHandler).not.toHaveBeenCalled()

    const promiseFetchMock = helpers.stubFetchResponses(
      helpers.toJsonResponse(helpers.createTokenResponseBody()),
      helpers.toJsonResponse({ code: -22345, message: 'Promise bad request' }, 400)
    )

    await expect(helpers.promiseCompat.TaxinvoiceService().getURL('1234567890', 'SBOX')).rejects.toMatchObject({
      code: -22345,
      stage: 'request_api',
    })

    expect(promiseFetchMock).toHaveBeenCalledTimes(2)
    expect(defaultErrorHandler).toHaveBeenCalledTimes(1)
  })

  test('scoped issue callback does not route success callback exceptions to error callback', async () => {
    const defaultErrorHandler = vi.fn()
    helpers.configureCompat(defaultErrorHandler)
    const fetchMock = helpers.stubFetchResponses(
      helpers.toJsonResponse(helpers.createTokenResponseBody()),
      helpers.toJsonResponse({ code: 1, message: 'issued' })
    )
    const callbackError = vi.fn()

    helpers.compat.TaxinvoiceService().issue(
      '1234567890',
      'SELL',
      'MGT-SUCCESS-THROW',
      'memo',
      () => {
        throw new Error('success callback failed')
      },
      callbackError
    )

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(callbackError).not.toHaveBeenCalled()
    expect(defaultErrorHandler).not.toHaveBeenCalled()
  })

  test('bulk result callback does not route success callback exceptions to error callback', async () => {
    const defaultErrorHandler = vi.fn()
    helpers.configureCompat(defaultErrorHandler)
    const fetchMock = helpers.stubFetchResponses(
      helpers.toJsonResponse(helpers.createTokenResponseBody()),
      helpers.toJsonResponse({ code: 1, message: 'complete', receiptID: 'RID-1', state: 2 })
    )
    const callbackError = vi.fn()

    helpers.compat.TaxinvoiceService().getBulkResult(
      '1234567890',
      'SUBMIT-1',
      () => {
        throw new Error('bulk result success callback failed')
      },
      callbackError
    )

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(callbackError).not.toHaveBeenCalled()
    expect(defaultErrorHandler).not.toHaveBeenCalled()
  })

  test('bulk result callback observes async success callback rejections', async () => {
    const defaultErrorHandler = vi.fn()
    helpers.configureCompat(defaultErrorHandler)
    const fetchMock = helpers.stubFetchResponses(
      helpers.toJsonResponse(helpers.createTokenResponseBody()),
      helpers.toJsonResponse({ code: 1, message: 'complete', receiptID: 'RID-2', state: 2 })
    )
    const callbackError = vi.fn()

    helpers.compat.TaxinvoiceService().getBulkResult(
      '1234567890',
      'SUBMIT-2',
      async () => {
        throw new Error('bulk result async success callback failed')
      },
      callbackError
    )

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(callbackError).not.toHaveBeenCalled()
    expect(defaultErrorHandler).not.toHaveBeenCalled()
  })
})
