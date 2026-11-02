import * as helpers from './helpers'

describe('legacy register writeSpecification option', () => {
  beforeEach(() => helpers.configureCompat())
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  test('promise forwards the flag after UserID without mutating the invoice', async () => {
    const document = Object.freeze({ issueType: '정발행' as const })
    const fetchMock = helpers.stubFetchResponses(
      helpers.toJsonResponse(helpers.createTokenResponseBody()),
      helpers.toJsonResponse({ code: 1, message: 'OK' })
    )
    await helpers.promiseCompat.TaxinvoiceService().register('1234567890', document, 'user', true)
    expect(JSON.parse(helpers.getTaxinvoiceRequestInit(fetchMock).body as string)).toEqual({ issueType: '정발행', writeSpecification: true })
    expect((helpers.getTaxinvoiceRequestInit(fetchMock).headers as Record<string, string>)['x-pb-userid']).toBe('user')
    expect(document).toEqual({ issueType: '정발행' })
  })

  test('callback full form delivers success from its original position', async () => {
    const fetchMock = helpers.stubFetchResponses(
      helpers.toJsonResponse(helpers.createTokenResponseBody()),
      helpers.toJsonResponse({ code: 1, message: 'OK' })
    )
    const result = await new Promise<unknown>((resolve, reject) =>
      helpers.compat.TaxinvoiceService().register('1234567890', { issueType: '정발행' }, 'user', true, resolve, reject)
    )
    expect(result).toEqual({ code: 1, message: 'OK' })
    expect(JSON.parse(helpers.getTaxinvoiceRequestInit(fetchMock).body as string)).toEqual({ issueType: '정발행', writeSpecification: true })
  })

  test('callback full form delivers API errors to its original error slot', async () => {
    helpers.stubFetchResponses(
      helpers.toJsonResponse(helpers.createTokenResponseBody()),
      helpers.toJsonResponse({ code: -12345, message: 'failed' }, 400)
    )
    const result = await new Promise<unknown>((resolve) =>
      helpers.compat.TaxinvoiceService().register('1234567890', { issueType: '정발행' }, 'user', true, undefined, resolve)
    )
    expect(result).toMatchObject({ code: -12345 })
  })
})
