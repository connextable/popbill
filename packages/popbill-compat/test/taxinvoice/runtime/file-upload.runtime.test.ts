import { fileURLToPath } from 'node:url'
import * as helpers from './helpers'

describe('taxinvoice runtime: file upload', () => {
  beforeEach(() => {
    helpers.configureCompat()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  test.each([
    { displayName: '', expectedFileName: 'README.md' },
    { displayName: 'attachment.md', expectedFileName: 'attachment.md' },
  ])('attachFile sends filename $expectedFileName for display name "$displayName"', async ({ displayName, expectedFileName }) => {
    const fetchMock = helpers.stubFetchResponses(
      helpers.toJsonResponse(helpers.createTokenResponseBody()),
      helpers.toJsonResponse({ code: 1, message: 'attached' })
    )
    const filePath = fileURLToPath(new URL('../../../README.md', import.meta.url))

    await helpers.promiseCompat.TaxinvoiceService().attachFile('1234567890', 'SELL', 'MGT-FILE', displayName, filePath)

    const requestInit = helpers.getTaxinvoiceRequestInit(fetchMock)
    const requestBody = Buffer.from(requestInit.body as Uint8Array).toString('utf8')
    expect(requestBody).toContain(`name="Filedata"; filename="${expectedFileName}";`)
    expect(requestBody).toContain('# @connextable/popbill-compat')
  })
})
