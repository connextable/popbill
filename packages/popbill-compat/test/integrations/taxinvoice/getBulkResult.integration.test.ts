import { describeTaxinvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxinvoiceIntegration('taxinvoice compat integration: getBulkResult', () => {
  test('getBulkResult succeeds', async () => {
    const context = testkit.createTaxinvoiceMethodContext()
    const submissionIdentifier = testkit.createSubmissionIdentifier('BRS')

    testkit.expectApiSuccess(
      await context.service.bulkSubmit(
        context.businessNumber,
        submissionIdentifier,
        [
          testkit.createTaxInvoiceDocument({
            businessNumber: context.businessNumber,
            counterpartCorpNum: context.env.counterpartCorpNum,
            managementKey: testkit.createManagementKey('BRS'),
            writeDate: context.today,
            receiverEmail: context.env.receiverEmail,
          }),
        ],
        false,
        context.userId
      )
    )

    const response = await context.service.getBulkResult(context.businessNumber, submissionIdentifier, context.userId)
    expect(typeof response.code).toBe('number')
    expect(typeof response.message).toBe('string')
  }, 180_000)
})
