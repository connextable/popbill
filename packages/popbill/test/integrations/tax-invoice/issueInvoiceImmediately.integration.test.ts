import { describeTaxInvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxInvoiceIntegration('popbill tax-invoice integration: issueInvoiceImmediately', () => {
  test('issueInvoiceImmediately succeeds', async () => {
    const context = testkit.createTaxInvoiceMethodContext()
    const managementKey = testkit.createManagementKey('IMD')
    testkit.expectApiSuccess(
      await context.service.issueInvoiceImmediately({
        businessNumber: context.businessNumber,
        taxInvoiceDocument: testkit.createTaxInvoiceDocument({
          businessNumber: context.businessNumber,
          counterpartBusinessNumber: context.env.counterpartCorpNum,
          managementKey,
          writtenDate: context.today,
          receiverEmail: context.env.receiverEmail,
        }),
        historyMemo: 'integration immediate issue',
        emailSubject: 'integration immediate issue',
        forceIssue: false,
      })
    )
  }, 180_000)
})
