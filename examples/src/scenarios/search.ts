import {
  TaxInvoiceCloseDownStateCodes,
  TaxInvoiceDateType,
  TaxInvoiceSearchInvoiceTypeCodes,
  TaxInvoiceSearchTaxationTypeCodes,
  TaxInvoiceSortOrder,
} from '../types.ts'
import type { ExampleContext, Runner, ScenarioDefinition, SearchInvoicesInput } from '../types.ts'
import { summarizeAccessUrl, summarizeSearchResult } from '../utils/summarizers.ts'

export const searchScenario: ScenarioDefinition = {
  description: '검색/문서함 URL',
  async run(context: ExampleContext, runner: Runner): Promise<void> {
    const searchInput: SearchInvoicesInput = {
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
    }

    await runner.run(
      'searchInvoices',
      searchInput,
      () => context.service.searchInvoices(searchInput),
      summarizeSearchResult
    )

    await runner.run(
      'getTaxInvoiceBoxURL',
      {
        businessNumber: context.businessNumber,
        taxInvoiceBoxScope: 'TBOX',
      },
      () =>
        context.service.getTaxInvoiceBoxURL({
          businessNumber: context.businessNumber,
          taxInvoiceBoxScope: 'TBOX',
        }),
      summarizeAccessUrl
    )
  },
}
