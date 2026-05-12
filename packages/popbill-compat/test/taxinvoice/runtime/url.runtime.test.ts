import * as helpers from './helpers'

describe('taxinvoice runtime: url', () => {
  beforeEach(() => {
    helpers.configureCompat()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  test('promise getSealURL and getCertificateExpireDate call ETC/CERT endpoints', async () => {
    const sealFetchMock = helpers.stubFetchResponses(
      helpers.toJsonResponse(helpers.createTokenResponseBody()),
      helpers.toJsonResponse({ url: 'https://example.com/seal' })
    )

    const seal = await helpers.promiseCompat.TaxinvoiceService().getSealURL('1234567890', 'seal-user')
    expect(seal).toMatchObject({ url: 'https://example.com/seal' })
    helpers.expectTaxinvoiceRequestPath(sealFetchMock, '/Member?TG=SEAL')

    const certFetchMock = helpers.stubFetchResponses(helpers.toJsonResponse({ certificateExpiration: '20260706145209' }))

    const expiration = await helpers.promiseCompat.TaxinvoiceService().getCertificateExpireDate('1234567890', 'cert-user')
    expect(typeof expiration).toBe('string')
    expect(expiration.length).toBeGreaterThan(0)
    expect(String(certFetchMock.mock.calls[0]?.[0])).toContain('/Taxinvoice?cfg=CERT')
  })

  test('callback and promise URL methods return string URL', async () => {
    const callbackFetchMock = helpers.stubFetchResponses(
      helpers.toJsonResponse(helpers.createTokenResponseBody()),
      helpers.toJsonResponse({ url: 'https://example.com/view' })
    )

    const callbackUrl = await new Promise<string>((resolve, reject) => {
      helpers.compat.TaxinvoiceService().getViewURL(
        '1234567890',
        'SELL',
        'MGT-VIEW',
        (url: string) => {
          resolve(url)
        },
        (error: unknown) => {
          reject(helpers.asError(error))
        }
      )
    })

    expect(callbackUrl).toBe('https://example.com/view')
    helpers.expectTaxinvoiceRequestPath(callbackFetchMock, '/Taxinvoice/SELL/MGT-VIEW?TG=VIEW')

    const promiseFetchMock = helpers.stubFetchResponses(
      helpers.toJsonResponse(helpers.createTokenResponseBody()),
      helpers.toJsonResponse({ url: 'https://example.com/pdf' })
    )

    const promiseUrl = await helpers.promiseCompat.TaxinvoiceService().getPDFURL('1234567890', 'SELL', 'MGT-PDF', 'pdf-user')
    expect(promiseUrl).toBe('https://example.com/pdf')
    helpers.expectTaxinvoiceRequestPath(promiseFetchMock, '/Taxinvoice/SELL/MGT-PDF?TG=PDF')
    const requestHeaders = helpers.getTaxinvoiceRequestInit(promiseFetchMock).headers as Record<string, string>
    expect(requestHeaders['x-pb-userid']).toBe('pdf-user')
  })

  test('getURL returns string URL in callback and promise paths', async () => {
    const callbackFetchMock = helpers.stubFetchResponses(
      helpers.toJsonResponse(helpers.createTokenResponseBody()),
      helpers.toJsonResponse({ url: 'https://example.com/tbox' })
    )

    const callbackUrl = await new Promise<string>((resolve, reject) => {
      helpers.compat.TaxinvoiceService().getURL(
        '1234567890',
        'TBOX',
        (url: string) => {
          resolve(url)
        },
        (error: unknown) => {
          reject(helpers.asError(error))
        }
      )
    })

    expect(callbackUrl).toBe('https://example.com/tbox')
    helpers.expectTaxinvoiceRequestPath(callbackFetchMock, '/Taxinvoice?TG=TBOX')

    const promiseFetchMock = helpers.stubFetchResponses(
      helpers.toJsonResponse(helpers.createTokenResponseBody()),
      helpers.toJsonResponse({ url: 'https://example.com/sbox' })
    )

    const promiseUrl = await helpers.promiseCompat.TaxinvoiceService().getURL('1234567890', 'SBOX', 'menu-user')
    expect(promiseUrl).toBe('https://example.com/sbox')
    helpers.expectTaxinvoiceRequestPath(promiseFetchMock, '/Taxinvoice?TG=SBOX')

    const requestHeaders = helpers.getTaxinvoiceRequestInit(promiseFetchMock).headers as Record<string, string>
    expect(requestHeaders['x-pb-userid']).toBe('menu-user')
  })

  test('getMassPrintURL sends POST body and returns URL string', async () => {
    const fetchMock = helpers.stubFetchResponses(
      helpers.toJsonResponse(helpers.createTokenResponseBody()),
      helpers.toJsonResponse({ url: 'https://example.com/mass-print' })
    )

    const resultUrl = await new Promise<string>((resolve, reject) => {
      helpers.compat.TaxinvoiceService().getMassPrintURL(
        '1234567890',
        'SELL',
        ['MGT-101', 'MGT-102'],
        'mass-user',
        (url: string) => {
          resolve(url)
        },
        (error: unknown) => {
          reject(helpers.asError(error))
        }
      )
    })

    expect(resultUrl).toBe('https://example.com/mass-print')
    helpers.expectTaxinvoiceRequestPath(fetchMock, '/Taxinvoice/SELL?Print')

    const requestInit = helpers.getTaxinvoiceRequestInit(fetchMock)
    expect(requestInit.method).toBe('POST')
    expect(requestInit.body).toBe('["MGT-101","MGT-102"]')

    const requestHeaders = requestInit.headers as Record<string, string>
    expect(requestHeaders['x-pb-userid']).toBe('mass-user')
  })
})
