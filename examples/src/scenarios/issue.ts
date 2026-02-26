import type { ExampleContext, Runner, ScenarioDefinition } from '../types.ts'
import { createManagementKey } from '../taxinvoice-fixtures.ts'
import { createDocument, createDraftInvoice, createIssuedInvoice } from '../workflows/invoice.ts'
import { summarizeDocumentOutput, summarizeOperationResult } from '../utils/summarizers.ts'

export const issueScenario: ScenarioDefinition = {
  description: '등록/수정/발행/즉시발행/취소/삭제/국세청전송',
  async run(context: ExampleContext, runner: Runner): Promise<void> {
    const immediateKey = createManagementKey('IMD')
    const immediateInput = {
      businessNumber: context.businessNumber,
      taxInvoiceDocument: createDocument(context, immediateKey),
      historyMemo: 'examples immediate issue',
      emailSubject: 'examples immediate issue',
      forceIssue: false,
    }
    await runner.run(
      'issueInvoiceImmediately',
      immediateInput,
      () => context.service.issueInvoiceImmediately(immediateInput),
      summarizeOperationResult
    )

    const issuedKey = await createIssuedInvoice(context, runner, 'ISS')
    if (issuedKey) {
      context.shared.primaryIssuedManagementKey = issuedKey

      const issuedDetailInput = {
        businessNumber: context.businessNumber,
        invoiceDocumentKeyType: context.invoiceDocumentKeyType,
        invoiceManagementKey: issuedKey,
      }
      await runner.run(
        'getInvoiceDetailInfo (lineItems verify)',
        issuedDetailInput,
        () => context.service.getInvoiceDetailInfo(issuedDetailInput),
        summarizeDocumentOutput
      )

      const sendToNTSInput = {
        businessNumber: context.businessNumber,
        invoiceDocumentKeyType: context.invoiceDocumentKeyType,
        invoiceManagementKey: issuedKey,
      }
      await runner.run(
        'sendInvoiceToNTS',
        sendToNTSInput,
        () => context.service.sendInvoiceToNTS(sendToNTSInput),
        summarizeOperationResult
      )
    }

    const cancelTargetKey = await createIssuedInvoice(context, runner, 'CNL')
    if (cancelTargetKey) {
      const cancelInput = {
        businessNumber: context.businessNumber,
        invoiceDocumentKeyType: context.invoiceDocumentKeyType,
        invoiceManagementKey: cancelTargetKey,
        historyMemo: 'examples cancel issue',
      }
      await runner.run(
        'cancelIssuedInvoice',
        cancelInput,
        () => context.service.cancelIssuedInvoice(cancelInput),
        summarizeOperationResult
      )
    }

    const deleteTargetKey = await createDraftInvoice(context, runner, 'DEL')
    if (deleteTargetKey) {
      const deleteInput = {
        businessNumber: context.businessNumber,
        invoiceDocumentKeyType: context.invoiceDocumentKeyType,
        invoiceManagementKey: deleteTargetKey,
      }
      await runner.run(
        'deleteInvoice',
        deleteInput,
        () => context.service.deleteInvoice(deleteInput),
        summarizeOperationResult
      )
    }
  },
}
