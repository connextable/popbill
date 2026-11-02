import { createPopbillClient } from '@/index'
import {
  TaxInvoiceBoxScopes,
  TaxInvoiceDateType,
  TaxInvoiceDocumentKeyTypes,
  TaxInvoiceSearchInvoiceTypeCodes,
  TaxInvoiceSearchTaxationTypeCodes,
  TaxInvoiceSortOrder,
} from '@/services/tax-invoice'

const MOCK_CORP_NUM = '1234567890'
const MOCK_COUNTERPART_CORP_NUM = '8888888888'
describe('tax-invoice facade mock contract', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('exercises representative lifecycle calls without Popbill API credentials', async () => {
    const operationResult = { code: 1, message: 'mock success' }
    const invoiceInfo = { itemKey: 'MOCK-ITEM-KEY', stateCode: 300 }
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(Response.json({ session_token: 'mock-token', expiration: '2099-01-01T00:00:00Z', serviceID: 'POPBILL_TEST' }))
      .mockResolvedValueOnce(Response.json(operationResult))
      .mockResolvedValueOnce(Response.json({ ...operationResult, ntsConfirmNum: 'NTS-001' }))
      .mockResolvedValueOnce(Response.json(invoiceInfo))
      .mockResolvedValueOnce(Response.json({ ...operationResult, list: [invoiceInfo] }))
      .mockResolvedValueOnce(Response.json({ url: 'https://mock.popbill.local/tax-invoice' }))
    vi.stubGlobal('fetch', fetchMock)
    const service = createPopbillClient({
      linkId: 'MOCK_LINK_ID',
      secretKey: Buffer.from('mock-secret').toString('base64'),
      userId: 'mock-user',
      isTest: true,
      useLocalTime: true,
      requestTimeoutMs: 30_000,
      acceptEncoding: 'gzip',
    }).services.taxInvoice
    const today = '20260224'
    const managementKey = 'MOCK-001'

    await expect(
      service.registerInvoice({
        businessNumber: MOCK_CORP_NUM,
        taxInvoiceDocument: {
          writtenDate: today,
          supplier: { businessNumber: MOCK_CORP_NUM, managementKey },
          buyer: { businessNumber: MOCK_COUNTERPART_CORP_NUM },
        },
      })
    ).resolves.toMatchObject({ resultCode: 1, resultMessage: 'mock success' })

    await expect(
      service.issueInvoice({
        businessNumber: MOCK_CORP_NUM,
        invoiceDocumentKeyType: TaxInvoiceDocumentKeyTypes.Sales,
        invoiceManagementKey: managementKey,
        historyMemo: 'mock issue',
        emailSubject: 'mock issue',
        forceIssue: false,
      })
    ).resolves.toMatchObject({ resultCode: 1, nationalTaxServiceConfirmationNumber: 'NTS-001' })

    const info = await service.getInvoiceInfo({
      businessNumber: MOCK_CORP_NUM,
      invoiceDocumentKeyType: TaxInvoiceDocumentKeyTypes.Sales,
      invoiceManagementKey: managementKey,
    })
    expect(info.itemKey).toBe('MOCK-ITEM-KEY')

    const searchResult = await service.searchInvoices({
      businessNumber: MOCK_CORP_NUM,
      invoiceDocumentKeyType: TaxInvoiceDocumentKeyTypes.Sales,
      searchDateType: TaxInvoiceDateType.Registered,
      startDate: today,
      endDate: today,
      invoiceStateCodes: ['3**'],
      invoiceTypeCodes: [TaxInvoiceSearchInvoiceTypeCodes.Normal],
      taxationTypeCodes: [TaxInvoiceSearchTaxationTypeCodes.Taxable],
      lateIssueOnly: null,
      sortOrder: TaxInvoiceSortOrder.Descending,
      pageNumber: 1,
      pageSize: 100,
    })
    expect(searchResult.invoiceSummaries).toHaveLength(1)

    await expect(
      service.getTaxInvoiceBoxURL({
        businessNumber: MOCK_CORP_NUM,
        taxInvoiceBoxScope: TaxInvoiceBoxScopes.TemporaryDocumentBox,
      })
    ).resolves.toEqual({ accessUrl: 'https://mock.popbill.local/tax-invoice' })

    const urls = fetchMock.mock.calls.map(([input]) => new URL(input instanceof Request ? input.url : String(input)))
    expect(urls.map((url) => url.pathname)).toEqual([
      '/POPBILL_TEST/Token',
      '/Taxinvoice',
      '/Taxinvoice/SELL/MOCK-001',
      '/Taxinvoice/SELL/MOCK-001',
      '/Taxinvoice/SELL',
      '/Taxinvoice',
    ])
    expect(new Headers(fetchMock.mock.calls[2]?.[1]?.headers).get('X-HTTP-Method-Override')).toBe('ISSUE')
    expect(JSON.parse(fetchMock.mock.calls[1]?.[1]?.body as string)).toMatchObject({
      writeDate: '20260224',
      invoicerMgtKey: 'MOCK-001',
      invoiceeCorpNum: MOCK_COUNTERPART_CORP_NUM,
    })
    expect(urls[4]?.searchParams.get('State')).toBe('3**')
    expect(urls[5]?.searchParams.get('TG')).toBe('TBOX')
  })
})
