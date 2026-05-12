import { createManagementKey, createSubmissionIdentifier } from '../taxinvoice-fixtures.ts'
import type { ExampleContext, Runner, ScenarioDefinition } from '../types.ts'
import { createDocument } from '../workflows/invoice.ts'
import { summarizeOperationResult } from '../utils/summarizers.ts'

export const bulkScenario: ScenarioDefinition = {
  description: '초대량발행 접수/접수결과조회',
  async run(context: ExampleContext, runner: Runner): Promise<void> {
    const submissionIdentifier = createSubmissionIdentifier('BLK')
    const submitBulkIssueInput = {
      businessNumber: context.businessNumber,
      submissionIdentifier,
      taxInvoiceDocuments: [createDocument(context, createManagementKey('B01')), createDocument(context, createManagementKey('B02'))],
      forceIssue: false,
    }

    await runner.run('submitBulkIssue', submitBulkIssueInput, () => context.service.submitBulkIssue(submitBulkIssueInput), summarizeOperationResult)

    const getBulkIssueSubmissionResultInput = {
      businessNumber: context.businessNumber,
      submissionIdentifier,
    }
    await runner.run(
      'getBulkIssueSubmissionResult',
      getBulkIssueSubmissionResultInput,
      () => context.service.getBulkIssueSubmissionResult(getBulkIssueSubmissionResultInput),
      summarizeOperationResult
    )
  },
}
