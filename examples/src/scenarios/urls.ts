import type { ExampleContext, Runner, ScenarioDefinition } from '../types.ts'
import { ensureIssuedInvoice } from '../workflows/invoice.ts'
import { summarizeAccessUrl } from '../utils/summarizers.ts'

export const urlsScenario: ScenarioDefinition = {
  description: '문서함/팝업/보기/인쇄/PDF/메일/인감등록 URL',
  async run(context: ExampleContext, runner: Runner): Promise<void> {
    const managementKey = await ensureIssuedInvoice(context, runner, 'URL')
    if (!managementKey) {
      return
    }

    const documentInput = {
      businessNumber: context.businessNumber,
      invoiceDocumentKeyType: context.invoiceDocumentKeyType,
      invoiceManagementKey: managementKey,
    }

    const bulkInput = {
      businessNumber: context.businessNumber,
      invoiceDocumentKeyType: context.invoiceDocumentKeyType,
      invoiceManagementKeys: [managementKey],
    }

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

    await runner.run(
      'getInvoicePopupURL',
      documentInput,
      () => context.service.getInvoicePopupURL(documentInput),
      summarizeAccessUrl
    )
    await runner.run(
      'getInvoiceViewURL',
      documentInput,
      () => context.service.getInvoiceViewURL(documentInput),
      summarizeAccessUrl
    )
    await runner.run(
      'getSupplierInvoicePrintURL',
      documentInput,
      () => context.service.getSupplierInvoicePrintURL(documentInput),
      summarizeAccessUrl
    )
    await runner.run(
      'getBuyerInvoicePrintURL',
      documentInput,
      () => context.service.getBuyerInvoicePrintURL(documentInput),
      summarizeAccessUrl
    )
    await runner.run(
      'getBulkInvoicePrintURL',
      bulkInput,
      () => context.service.getBulkInvoicePrintURL(bulkInput),
      summarizeAccessUrl
    )
    await runner.run(
      'getInvoiceMailURL',
      documentInput,
      () => context.service.getInvoiceMailURL(documentInput),
      summarizeAccessUrl
    )
    await runner.run(
      'getInvoicePDFURL',
      documentInput,
      () => context.service.getInvoicePDFURL(documentInput),
      summarizeAccessUrl
    )
    await runner.run(
      'getSealAndAttachmentRegistrationURL',
      { businessNumber: context.businessNumber },
      () =>
        context.service.getSealAndAttachmentRegistrationURL({
          businessNumber: context.businessNumber,
        }),
      summarizeAccessUrl
    )
  },
}
