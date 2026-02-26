import type { ExampleContext, Runner, ScenarioDefinition } from '../types.ts'
import { ensureIssuedInvoice } from '../workflows/invoice.ts'
import {
  summarizeArrayLength,
  summarizeDocumentOutput,
  summarizeInvoiceInfo,
  summarizeKeyUsage,
  summarizeXmlOutput,
} from '../utils/summarizers.ts'

export const inquiryScenario: ScenarioDefinition = {
  description: '상태조회/다건조회/상세조회/XML/로그/관리번호사용여부',
  async run(context: ExampleContext, runner: Runner): Promise<void> {
    const managementKey = await ensureIssuedInvoice(context, runner, 'INQ')
    if (!managementKey) {
      return
    }

    const documentInput = {
      businessNumber: context.businessNumber,
      invoiceDocumentKeyType: context.invoiceDocumentKeyType,
      invoiceManagementKey: managementKey,
    }

    await runner.run(
      'getInvoiceInfo',
      documentInput,
      () => context.service.getInvoiceInfo(documentInput),
      summarizeInvoiceInfo
    )

    const infosInput = {
      businessNumber: context.businessNumber,
      invoiceDocumentKeyType: context.invoiceDocumentKeyType,
      invoiceManagementKeys: [managementKey],
    }
    await runner.run(
      'getInvoicesInfo',
      infosInput,
      () => context.service.getInvoicesInfo(infosInput),
      summarizeArrayLength
    )

    await runner.run(
      'getInvoiceDetailInfo',
      documentInput,
      () => context.service.getInvoiceDetailInfo(documentInput),
      summarizeDocumentOutput
    )

    await runner.run(
      'checkInvoiceManagementKeyInUse',
      documentInput,
      () => context.service.checkInvoiceManagementKeyInUse(documentInput),
      summarizeKeyUsage
    )

    await runner.run(
      'getInvoiceXML',
      documentInput,
      () => context.service.getInvoiceXML(documentInput),
      summarizeXmlOutput
    )

    await runner.run(
      'getInvoiceLogs',
      documentInput,
      () => context.service.getInvoiceLogs(documentInput),
      summarizeArrayLength
    )
  },
}
