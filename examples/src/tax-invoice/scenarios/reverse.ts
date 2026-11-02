import { createManagementKey } from '../taxinvoice-fixtures.ts'
import { createCounterpartExampleContext } from '../context.ts'
import type { ExampleContext, Runner, ScenarioDefinition } from '../types.ts'
import { createDocument, createReverseRequestedInvoice } from '../workflows/invoice.ts'
import { summarizeOperationResult } from '../utils/summarizers.ts'
import { logWarn } from '../utils/log.ts'

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

    const reverseCancelKeys = await createReverseRequestedInvoice(context, runner, 'RVC')
    if (reverseCancelKeys) {
      const cancelReverseInput = {
        businessNumber: context.businessNumber,
        invoiceDocumentKeyType: 'BUY' as const,
        invoiceManagementKey: reverseCancelKeys.requestManagementKey,
        historyMemo: 'examples reverse cancel request',
      }
      await runner.run(
        'cancelReverseIssueRequest',
        cancelReverseInput,
        () => context.service.cancelReverseIssueRequest(cancelReverseInput),
        summarizeOperationResult
      )
    }

    const supplierContext = createCounterpartExampleContext(context)
    if (!supplierContext) {
      logWarn('refuseReverseIssueRequest skipped', { reason: 'POPBILL_COUNTERPART_USER_ID is required for the supplier account' })
      return
    }

    const reverseRefuseKeys = await createReverseRequestedInvoice(context, runner, 'RRF')
    if (reverseRefuseKeys) {
      const refuseReverseInput = {
        businessNumber: supplierContext.businessNumber,
        invoiceDocumentKeyType: 'SELL' as const,
        invoiceManagementKey: reverseRefuseKeys.refuseManagementKey,
        historyMemo: 'examples reverse refuse request',
      }
      await runner.run(
        'refuseReverseIssueRequest',
        refuseReverseInput,
        () => supplierContext.service.refuseReverseIssueRequest(refuseReverseInput),
        summarizeOperationResult
      )
    }
  },
}
