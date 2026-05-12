import { describeTaxInvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxInvoiceIntegration('popbill tax-invoice integration: getBulkIssueSubmissionResult', () => {
  test('getBulkIssueSubmissionResult succeeds', async () => {
    const context = testkit.createTaxInvoiceMethodContext()
    const submissionIdentifier = testkit.createSubmissionIdentifier('BRS')

    testkit.expectApiSuccess(
      await context.service.submitBulkIssue({
        businessNumber: context.businessNumber,
        submissionIdentifier,
        taxInvoiceDocuments: [
          testkit.createTaxInvoiceDocument({
            businessNumber: context.businessNumber,
            counterpartBusinessNumber: context.env.counterpartCorpNum,
            managementKey: testkit.createManagementKey('BRS'),
            writtenDate: context.today,
            receiverEmail: context.env.receiverEmail,
          }),
        ],
        forceIssue: false,
      })
    )

    const response = await context.service.getBulkIssueSubmissionResult({
      businessNumber: context.businessNumber,
      submissionIdentifier,
    })

    expect(typeof response.resultCode).toBe('number')
    expect(typeof response.resultMessage).toBe('string')
  }, 180_000)
})
