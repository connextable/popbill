import { describeTaxInvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'
import {
  TaxInvoiceCloseDownStateCodes,
  TaxInvoiceDateType,
  TaxInvoiceSearchInvoiceTypeCodes,
  TaxInvoiceSearchTaxationTypeCodes,
  TaxInvoiceSortOrder,
} from '@/services/tax-invoice/types'

describeTaxInvoiceIntegration('popbill tax-invoice integration: searchInvoices', () => {
  test('searchInvoices succeeds', async () => {
    const context = testkit.createTaxInvoiceMethodContext()
    const response = await context.service.searchInvoices({
      businessNumber: context.businessNumber,
      invoiceDocumentKeyType: context.invoiceDocumentKeyType,
      searchDateType: TaxInvoiceDateType.Registered,
      startDate: context.searchStartDate,
      endDate: context.today,
      invoiceStateCodes: ['3**'],
      invoiceTypeCodes: [TaxInvoiceSearchInvoiceTypeCodes.Normal, TaxInvoiceSearchInvoiceTypeCodes.Modified],
      taxationTypeCodes: [
        TaxInvoiceSearchTaxationTypeCodes.Taxable,
        TaxInvoiceSearchTaxationTypeCodes.Exempt,
        TaxInvoiceSearchTaxationTypeCodes.ZeroRated,
      ],
      lateIssueOnly: null,
      sortOrder: TaxInvoiceSortOrder.Descending,
      pageNumber: 1,
      pageSize: 100,
      closeDownStateCodes: [TaxInvoiceCloseDownStateCodes.NotRegistered],
    })

    expect(typeof response.operationResult.resultCode).toBe('number')
    expect(Array.isArray(response.invoiceSummaries)).toBe(true)
  }, 180_000)
})
