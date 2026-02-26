import type { ExampleContext, Runner, ScenarioDefinition } from '../types.ts'
import { summarizeAccessUrl, summarizeSearchResult } from '../utils/summarizers.ts'

export const searchScenario: ScenarioDefinition = {
  description: '검색/문서함 URL',
  async run(context: ExampleContext, runner: Runner): Promise<void> {
    const searchInput = {
      businessNumber: context.businessNumber,
      invoiceDocumentKeyType: context.invoiceDocumentKeyType,
      searchDateType: 'R' as const,
      startDate: context.searchStartDate,
      endDate: context.today,
      invoiceStateCodes: ['3**'],
      invoiceTypeCodes: ['N', 'M'],
      taxationTypeCodes: ['T', 'N', 'Z'],
      lateIssueOnly: null,
      sortOrder: 'D',
      pageNumber: 1,
      pageSize: 100,
      closeDownStateCodes: ['0' as const],
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
