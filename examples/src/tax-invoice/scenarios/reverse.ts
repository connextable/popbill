import { createManagementKey } from '../taxinvoice-fixtures.ts'
import type { ExampleContext, Runner, ScenarioDefinition } from '../types.ts'
import { createDocument, createReverseRequestedInvoice } from '../workflows/invoice.ts'
import { summarizeOperationResult } from '../utils/summarizers.ts'

export const reverseScenario: ScenarioDefinition = {
  description: '역발행 즉시요청/요청/요청취소/요청거부',
  async run(context: ExampleContext, runner: Runner): Promise<void> {
    const reverseImmediateKey = createManagementKey('RIM')
    const reverseImmediateInput = {
      businessNumber: context.businessNumber,
      taxInvoiceDocument: createDocument(context, reverseImmediateKey, { issueType: '역발행' }),
      historyMemo: 'examples reverse immediate request',
    }
    await runner.run(
      'requestReverseIssueImmediately',
      reverseImmediateInput,
      () => context.service.requestReverseIssueImmediately(reverseImmediateInput),
      summarizeOperationResult
    )

    const reverseCancelKey = await createReverseRequestedInvoice(context, runner, 'RVC')
    if (reverseCancelKey) {
      const cancelReverseInput = {
        businessNumber: context.businessNumber,
        invoiceDocumentKeyType: context.invoiceDocumentKeyType,
        invoiceManagementKey: reverseCancelKey,
        historyMemo: 'examples reverse cancel request',
      }
      await runner.run(
        'cancelReverseIssueRequest',
        cancelReverseInput,
        () => context.service.cancelReverseIssueRequest(cancelReverseInput),
        summarizeOperationResult
      )
    }

    const reverseRefuseKey = await createReverseRequestedInvoice(context, runner, 'RRF')
    if (reverseRefuseKey) {
      const refuseReverseInput = {
        businessNumber: context.businessNumber,
        invoiceDocumentKeyType: context.invoiceDocumentKeyType,
        invoiceManagementKey: reverseRefuseKey,
        historyMemo: 'examples reverse refuse request',
      }
      await runner.run(
        'refuseReverseIssueRequest',
        refuseReverseInput,
        () => context.service.refuseReverseIssueRequest(refuseReverseInput),
        summarizeOperationResult
      )
    }
  },
}
