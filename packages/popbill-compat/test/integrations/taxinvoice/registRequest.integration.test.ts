import { describeTaxinvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxinvoiceIntegration('taxinvoice compat integration: registRequest', () => {
  test('registRequest succeeds', async () => {
    const context = testkit.createTaxinvoiceMethodContext()
    const managementKey = testkit.createManagementKey('RIM')

    testkit.expectApiSuccess(
      await context.service.registRequest(
        context.businessNumber,
        testkit.createTaxInvoiceDocument({
          businessNumber: context.businessNumber,
          counterpartCorpNum: context.env.counterpartCorpNum,
          managementKey,
          writeDate: context.today,
          receiverEmail: context.env.receiverEmail,
          issueType: '역발행',
        }),
        'integration reverse immediate request',
        context.userId
      )
    )
  }, 180_000)
})
