import {
  asError,
  compat,
  configureCompat,
  createTokenResponseBody,
  getTaxinvoiceRequestInit,
  expectTaxinvoiceRequestPath,
  promiseCompat,
  stubFetchResponses,
  toJsonResponse,
} from './helpers'

describe('taxinvoice runtime: url', () => {
  beforeEach(() => {
    configureCompat()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  test('promise getSealURL and getCertificateExpireDate call ETC/CERT endpoints', async () => {
    const sealFetchMock = stubFetchResponses(
      toJsonResponse(createTokenResponseBody()),
      toJsonResponse({ url: 'https://example.com/seal' })
    )

    const seal = await promiseCompat.TaxinvoiceService().getSealURL('1234567890', 'seal-user')
    expect(seal).toMatchObject({ url: 'https://example.com/seal' })
    expectTaxinvoiceRequestPath(sealFetchMock, '/Member?TG=SEAL')

    const certFetchMock = stubFetchResponses(toJsonResponse({ certificateExpiration: '20260706145209' }))

    const expiration = await promiseCompat.TaxinvoiceService().getCertificateExpireDate('1234567890', 'cert-user')
    expect(typeof expiration).toBe('string')
    expect(expiration.length).toBeGreaterThan(0)
    expect(String(certFetchMock.mock.calls[0]?.[0])).toContain('/Taxinvoice?cfg=CERT')
  })

  test('callback and promise URL methods return string URL', async () => {
    const callbackFetchMock = stubFetchResponses(
      toJsonResponse(createTokenResponseBody()),
      toJsonResponse({ url: 'https://example.com/view' })
    )

    const callbackUrl = await new Promise<string>((resolve, reject) => {
      compat.TaxinvoiceService().getViewURL(
        '1234567890',
        'SELL',
        'MGT-VIEW',
        (url: string) => {
          resolve(url)
        },
        (error: unknown) => {
          reject(asError(error))
        }
      )
    })

    expect(callbackUrl).toBe('https://example.com/view')
    expectTaxinvoiceRequestPath(callbackFetchMock, '/Taxinvoice/SELL/MGT-VIEW?TG=VIEW')

    const promiseFetchMock = stubFetchResponses(
      toJsonResponse(createTokenResponseBody()),
      toJsonResponse({ url: 'https://example.com/pdf' })
    )

    const promiseUrl = await promiseCompat.TaxinvoiceService().getPDFURL('1234567890', 'SELL', 'MGT-PDF', 'pdf-user')
    expect(promiseUrl).toBe('https://example.com/pdf')
    expectTaxinvoiceRequestPath(promiseFetchMock, '/Taxinvoice/SELL/MGT-PDF?TG=PDF')
    const requestHeaders = getTaxinvoiceRequestInit(promiseFetchMock).headers as Record<string, string>
    expect(requestHeaders['x-pb-userid']).toBe('pdf-user')
  })

  test('getURL returns string URL in callback and promise paths', async () => {
    const callbackFetchMock = stubFetchResponses(
      toJsonResponse(createTokenResponseBody()),
      toJsonResponse({ url: 'https://example.com/tbox' })
    )

    const callbackUrl = await new Promise<string>((resolve, reject) => {
      compat.TaxinvoiceService().getURL(
        '1234567890',
        'TBOX',
        (url: string) => {
          resolve(url)
        },
        (error: unknown) => {
          reject(asError(error))
        }
      )
    })

    expect(callbackUrl).toBe('https://example.com/tbox')
    expectTaxinvoiceRequestPath(callbackFetchMock, '/Taxinvoice?TG=TBOX')

    const promiseFetchMock = stubFetchResponses(
      toJsonResponse(createTokenResponseBody()),
      toJsonResponse({ url: 'https://example.com/sbox' })
    )

    const promiseUrl = await promiseCompat.TaxinvoiceService().getURL('1234567890', 'SBOX', 'menu-user')
    expect(promiseUrl).toBe('https://example.com/sbox')
    expectTaxinvoiceRequestPath(promiseFetchMock, '/Taxinvoice?TG=SBOX')

    const requestHeaders = getTaxinvoiceRequestInit(promiseFetchMock).headers as Record<string, string>
    expect(requestHeaders['x-pb-userid']).toBe('menu-user')
  })

  test('getMassPrintURL sends POST body and returns URL string', async () => {
    const fetchMock = stubFetchResponses(
      toJsonResponse(createTokenResponseBody()),
      toJsonResponse({ url: 'https://example.com/mass-print' })
    )

    const resultUrl = await new Promise<string>((resolve, reject) => {
      compat.TaxinvoiceService().getMassPrintURL(
        '1234567890',
        'SELL',
        ['MGT-101', 'MGT-102'],
        'mass-user',
        (url: string) => {
          resolve(url)
        },
        (error: unknown) => {
          reject(asError(error))
        }
      )
    })

    expect(resultUrl).toBe('https://example.com/mass-print')
    expectTaxinvoiceRequestPath(fetchMock, '/Taxinvoice/SELL?Print')

    const requestInit = getTaxinvoiceRequestInit(fetchMock)
    expect(requestInit.method).toBe('POST')
    expect(requestInit.body).toBe('["MGT-101","MGT-102"]')

    const requestHeaders = requestInit.headers as Record<string, string>
    expect(requestHeaders['x-pb-userid']).toBe('mass-user')
  })
})
