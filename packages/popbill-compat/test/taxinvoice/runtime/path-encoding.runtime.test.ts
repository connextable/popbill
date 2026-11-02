import * as helpers from './helpers'

describe('taxinvoice runtime: path encoding', () => {
  beforeEach(() => {
    helpers.configureCompat()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  test('getInfo preserves reserved characters within the management key', async () => {
    const fetchMock = helpers.stubFetchResponses(
      helpers.toJsonResponse(helpers.createTokenResponseBody()),
      helpers.toJsonResponse({ itemKey: 'item-1', stateCode: 300 })
    )

    await helpers.promiseCompat.TaxinvoiceService().getInfo('1234567890', 'SELL', 'MGT/2026?#%&')

    const requestUrl = new URL(String(fetchMock.mock.calls[1]?.[0]))
    expect(requestUrl.pathname).toBe('/Taxinvoice/SELL/MGT%2F2026%3F%23%25%26')
    expect(requestUrl.search).toBe('')
    expect(requestUrl.hash).toBe('')
  })

  test('sendEmail targets the full management key when resending a message', async () => {
    const fetchMock = helpers.stubFetchResponses(
      helpers.toJsonResponse(helpers.createTokenResponseBody()),
      helpers.toJsonResponse({ code: 1, message: 'sent' })
    )

    await helpers.promiseCompat.TaxinvoiceService().sendEmail('1234567890', 'SELL', 'MGT/2026?#%&', 'receiver@example.com')

    const requestUrl = new URL(String(fetchMock.mock.calls[1]?.[0]))
    expect(requestUrl.pathname).toBe('/Taxinvoice/SELL/MGT%2F2026%3F%23%25%26')
    expect(requestUrl.search).toBe('')
    expect(requestUrl.hash).toBe('')
  })

  test('deleteFile preserves both the management key and file identifier', async () => {
    const fetchMock = helpers.stubFetchResponses(
      helpers.toJsonResponse(helpers.createTokenResponseBody()),
      helpers.toJsonResponse({ code: 1, message: 'deleted' })
    )

    await helpers.promiseCompat.TaxinvoiceService().deleteFile('1234567890', 'SELL', 'MGT/2026', 'FILE/1?#%&')

    const requestUrl = new URL(String(fetchMock.mock.calls[1]?.[0]))
    expect(requestUrl.pathname).toBe('/Taxinvoice/SELL/MGT%2F2026/Files/FILE%2F1%3F%23%25%26')
    expect(requestUrl.search).toBe('')
    expect(requestUrl.hash).toBe('')
  })

  test('assignMgtKey preserves the item identifier separately from the form body', async () => {
    const fetchMock = helpers.stubFetchResponses(
      helpers.toJsonResponse(helpers.createTokenResponseBody()),
      helpers.toJsonResponse({ code: 1, message: 'assigned' })
    )

    await helpers.promiseCompat.TaxinvoiceService().assignMgtKey('1234567890', 'SELL', 'ITEM/1?#%&', 'MGT&2026')

    const requestUrl = new URL(String(fetchMock.mock.calls[1]?.[0]))
    expect(requestUrl.pathname).toBe('/Taxinvoice/ITEM%2F1%3F%23%25%26/SELL')
    expect(requestUrl.search).toBe('')
    expect(requestUrl.hash).toBe('')
    expect(helpers.getTaxinvoiceRequestInit(fetchMock).body).toBe('MgtKey=MGT%262026')
  })
})
