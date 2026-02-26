import {
  compat,
  configureCompat,
  createTokenResponseBody,
  promiseCompat,
  stubFetchResponses,
  toJsonResponse,
} from './helpers'

describe('taxinvoice runtime: error-flow', () => {
  beforeEach(() => {
    configureCompat()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  test('callback path prefers error callback over defaultErrorHandler', async () => {
    const defaultErrorHandler = vi.fn()
    configureCompat(defaultErrorHandler)
    const fetchMock = stubFetchResponses(
      toJsonResponse(createTokenResponseBody()),
      toJsonResponse({ code: -12345, message: 'Bad request' }, 400)
    )
    const callbackError = vi.fn()

    await new Promise<void>((resolve) => {
      compat.TaxinvoiceService().getViewURL(
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
    configureCompat(defaultErrorHandler)

    const callbackFetchMock = stubFetchResponses(
      toJsonResponse(createTokenResponseBody()),
      toJsonResponse({ code: -12345, message: 'Bad request' }, 400)
    )

    compat.TaxinvoiceService().getViewURL('1234567890', 'SELL', 'MGT-ERROR-2', () => undefined)

    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(defaultErrorHandler).toHaveBeenCalledTimes(1)

    expect(callbackFetchMock).toHaveBeenCalledTimes(2)

    const promiseFetchMock = stubFetchResponses(
      toJsonResponse(createTokenResponseBody()),
      toJsonResponse({ code: -22345, message: 'Promise bad request' }, 400)
    )

    await expect(
      promiseCompat.TaxinvoiceService().getPDFURL('1234567890', 'SELL', 'MGT-ERROR-3')
    ).rejects.toMatchObject({
      code: -22345,
      stage: 'request_api',
    })

    expect(promiseFetchMock).toHaveBeenCalledTimes(2)
    expect(defaultErrorHandler).toHaveBeenCalledTimes(2)
  })

  test('getURL callback/promise error flow matches legacy order', async () => {
    const defaultErrorHandler = vi.fn()
    configureCompat(defaultErrorHandler)

    const callbackFetchMock = stubFetchResponses(
      toJsonResponse(createTokenResponseBody()),
      toJsonResponse({ code: -12345, message: 'Bad request' }, 400)
    )
    const callbackError = vi.fn()

    await new Promise<void>((resolve) => {
      compat.TaxinvoiceService().getURL(
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

    const promiseFetchMock = stubFetchResponses(
      toJsonResponse(createTokenResponseBody()),
      toJsonResponse({ code: -22345, message: 'Promise bad request' }, 400)
    )

    await expect(promiseCompat.TaxinvoiceService().getURL('1234567890', 'SBOX')).rejects.toMatchObject({
      code: -22345,
      stage: 'request_api',
    })

    expect(promiseFetchMock).toHaveBeenCalledTimes(2)
    expect(defaultErrorHandler).toHaveBeenCalledTimes(1)
  })
})
