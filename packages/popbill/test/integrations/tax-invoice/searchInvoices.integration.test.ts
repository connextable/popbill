import { describeTaxInvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxInvoiceIntegration('popbill tax-invoice integration: searchInvoices', () => {
  test('searchInvoices succeeds', async () => {
    const context = testkit.createTaxInvoiceMethodContext()
    const response = await context.service.searchInvoices({
      businessNumber: context.businessNumber,
      invoiceDocumentKeyType: context.invoiceDocumentKeyType,
      searchDateType: 'R',
      startDate: context.searchStartDate,
      endDate: context.today,
      invoiceStateCodes: ['3**'],
      invoiceTypeCodes: ['N', 'M'],
      taxationTypeCodes: ['T', 'N', 'Z'],
      lateIssueOnly: null,
      sortOrder: 'D',
      pageNumber: 1,
      pageSize: 100,
      closeDownStateCodes: ['0'],
    })

    expect(typeof response.operationResult.resultCode).toBe('number')
    expect(Array.isArray(response.invoiceSummaries)).toBe(true)
  }, 180_000)
})
