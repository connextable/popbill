import { describeTaxInvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxInvoiceIntegration('popbill tax-invoice integration: submitBulkIssue', () => {
  test('submitBulkIssue succeeds', async () => {
    const context = testkit.createTaxInvoiceMethodContext()
    testkit.expectApiSuccess(
      await context.service.submitBulkIssue({
        businessNumber: context.businessNumber,
        submissionIdentifier: testkit.createSubmissionIdentifier('BULK'),
        taxInvoiceDocuments: [
          testkit.createTaxInvoiceDocument({
            businessNumber: context.businessNumber,
            counterpartCorpNum: context.env.counterpartCorpNum,
            managementKey: testkit.createManagementKey('B01'),
            writeDate: context.today,
            receiverEmail: context.env.receiverEmail,
          }),
          testkit.createTaxInvoiceDocument({
            businessNumber: context.businessNumber,
            counterpartCorpNum: context.env.counterpartCorpNum,
            managementKey: testkit.createManagementKey('B02'),
            writeDate: context.today,
            receiverEmail: context.env.receiverEmail,
          }),
        ],
        forceIssue: false,
      })
    )
  }, 180_000)
})
