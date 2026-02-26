import { describeTaxinvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxinvoiceIntegration('taxinvoice compat integration: registIssue', () => {
  test('registIssue succeeds', async () => {
    const context = testkit.createTaxinvoiceMethodContext()
    const managementKey = testkit.createManagementKey('IMD')

    testkit.expectApiSuccess(
      await context.service.registIssue(
        context.businessNumber,
        testkit.createTaxInvoiceDocument({
          businessNumber: context.businessNumber,
          counterpartCorpNum: context.env.counterpartCorpNum,
          managementKey,
          writeDate: context.today,
          receiverEmail: context.env.receiverEmail,
        }),
        false,
        false,
        'integration immediate issue',
        'integration immediate issue',
        undefined,
        context.userId
      )
    )
  }, 180_000)
})
