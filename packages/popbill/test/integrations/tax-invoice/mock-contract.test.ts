import { createPopbillClient } from '@/index'
import {
  TaxInvoiceBoxScopes,
  TaxInvoiceDateType,
  TaxInvoiceDocumentKeyTypes,
  TaxInvoiceSearchInvoiceTypeCodes,
  TaxInvoiceSearchTaxationTypeCodes,
  TaxInvoiceSortOrder,
} from '@/services/tax-invoice'
import { createManagementKey, createTaxInvoiceDocument, expectApiSuccess, formatDate } from './method-testkit'
import { installTaxInvoiceMockFetch } from './mock-fetch'

const MOCK_CORP_NUM = '1234567890'
const MOCK_COUNTERPART_CORP_NUM = '8888888888'
const MOCK_RECEIVER_EMAIL = 'test@example.com'

describe('tax-invoice facade mock contract', () => {
  beforeEach(() => {
    installTaxInvoiceMockFetch()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  test('exercises representative lifecycle calls without Popbill API credentials', async () => {
    const service = createPopbillClient({
      linkId: 'MOCK_LINK_ID',
      secretKey: Buffer.from('mock-secret').toString('base64'),
      userId: 'mock-user',
      isTest: true,
      useLocalTime: true,
      requestTimeoutMs: 30_000,
      acceptEncoding: 'gzip',
    }).services.taxInvoice
    const today = formatDate(new Date())
    const managementKey = createManagementKey('MOCK')

    expectApiSuccess(
      await service.registerInvoice({
        businessNumber: MOCK_CORP_NUM,
        taxInvoiceDocument: createTaxInvoiceDocument({
          businessNumber: MOCK_CORP_NUM,
          counterpartBusinessNumber: MOCK_COUNTERPART_CORP_NUM,
          managementKey,
          writtenDate: today,
          receiverEmail: MOCK_RECEIVER_EMAIL,
        }),
      })
    )

    expectApiSuccess(
      await service.issueInvoice({
        businessNumber: MOCK_CORP_NUM,
        invoiceDocumentKeyType: TaxInvoiceDocumentKeyTypes.Sales,
        invoiceManagementKey: managementKey,
        historyMemo: 'mock issue',
        emailSubject: 'mock issue',
        forceIssue: false,
      })
    )

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
  })
})
