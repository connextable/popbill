import * as helpers from './helpers'

describe('taxinvoice runtime: info-search', () => {
  beforeEach(() => {
    helpers.configureCompat()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  test('promise getInfo calls info endpoint and returns response object', async () => {
    const fetchMock = helpers.stubFetchResponses(
      helpers.toJsonResponse(helpers.createTokenResponseBody()),
      helpers.toJsonResponse({
        itemKey: '025102114360700001',
        stateCode: 300,
      })
    )

    const response = await helpers.promiseCompat.TaxinvoiceService().getInfo('1234567890', 'SELL', 'MGT-INFO', 'info-user')

    expect(response).toMatchObject({
      itemKey: '025102114360700001',
      stateCode: 300,
    })
    helpers.expectTaxinvoiceRequestPath(fetchMock, '/Taxinvoice/SELL/MGT-INFO')
    const requestHeaders = helpers.getTaxinvoiceRequestInit(fetchMock).headers as Record<string, string>
    expect(requestHeaders['x-pb-userid']).toBe('info-user')
  })

  test('callback search builds query string with legacy parameters', async () => {
    const fetchMock = helpers.stubFetchResponses(
      helpers.toJsonResponse(helpers.createTokenResponseBody()),
      helpers.toJsonResponse({
        code: 1,
        total: 1,
        perPage: 500,
        pageNum: 1,
        pageCount: 1,
        list: [],
      })
    )

    await new Promise<void>((resolve, reject) => {
      helpers.compat.TaxinvoiceService().search(
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
        ['N', 0],
        'MGT-SEARCH',
        () => {
          resolve()
        },
        (error: unknown) => {
          reject(helpers.asError(error))
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
    expect(requestUrl).toContain('CloseDownState=N%2C0')
    expect(requestUrl).toContain('MgtKey=MGT-SEARCH')

    const requestHeaders = helpers.getTaxinvoiceRequestInit(fetchMock).headers as Record<string, string>
    expect(requestHeaders['x-pb-userid']).toBe('search-user')
  })
})
