import { describeTaxinvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxinvoiceIntegration('taxinvoice compat integration: bulkSubmit', () => {
  test('bulkSubmit succeeds', async () => {
    const context = testkit.createTaxinvoiceMethodContext()
    testkit.expectApiSuccess(
      await context.service.bulkSubmit(
        context.businessNumber,
        testkit.createSubmissionIdentifier('BULK'),
        [
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
        false,
        context.userId
      )
    )
  }, 180_000)
})
