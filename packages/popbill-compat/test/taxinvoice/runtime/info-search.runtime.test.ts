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

describe('taxinvoice runtime: info-search', () => {
  beforeEach(() => {
    configureCompat()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  test('promise getInfo calls info endpoint and returns response object', async () => {
    const fetchMock = stubFetchResponses(
      toJsonResponse(createTokenResponseBody()),
      toJsonResponse({
        itemKey: '025102114360700001',
        stateCode: 300,
      })
    )

    const response = await promiseCompat.TaxinvoiceService().getInfo('1234567890', 'SELL', 'MGT-INFO', 'info-user')

    expect(response).toMatchObject({
      itemKey: '025102114360700001',
      stateCode: 300,
    })
    expectTaxinvoiceRequestPath(fetchMock, '/Taxinvoice/SELL/MGT-INFO')
    const requestHeaders = getTaxinvoiceRequestInit(fetchMock).headers as Record<string, string>
    expect(requestHeaders['x-pb-userid']).toBe('info-user')
  })

  test('callback search builds query string with legacy parameters', async () => {
    const fetchMock = stubFetchResponses(
      toJsonResponse(createTokenResponseBody()),
      toJsonResponse({
        code: 1,
        total: 1,
        perPage: 500,
        pageNum: 1,
        pageCount: 1,
        list: [],
      })
    )

    await new Promise<void>((resolve, reject) => {
      compat.TaxinvoiceService().search(
        '1234567890',
        'SELL',
        'W',
        '20260101',
        '20260131',
        ['3**'],
        ['N'],
        ['T'],
        null,
        'D',
        1,
        100,
        'S',
        '1',
        '0001',
        '거래처',
        '1',
        'search-user',
        ['N'],
        ['P'],
        [0],
        'MGT-SEARCH',
        () => {
          resolve()
        },
        (error: unknown) => {
          reject(asError(error))
        }
      )
    })

    const requestUrl = String(fetchMock.mock.calls[1]?.[0])
    expect(requestUrl).toContain('/Taxinvoice/SELL?')
    expect(requestUrl).toContain('DType=W')
    expect(requestUrl).toContain('SDate=20260101')
    expect(requestUrl).toContain('EDate=20260131')
    expect(requestUrl).toContain('TaxRegIDType=S')
    expect(requestUrl).toContain('TaxRegIDYN=1')
    expect(requestUrl).toContain('TaxRegID=0001')
    expect(requestUrl).toContain('InterOPYN=1')
    expect(requestUrl).toContain('MgtKey=MGT-SEARCH')

    const requestHeaders = getTaxinvoiceRequestInit(fetchMock).headers as Record<string, string>
    expect(requestHeaders['x-pb-userid']).toBe('search-user')
  })
})
