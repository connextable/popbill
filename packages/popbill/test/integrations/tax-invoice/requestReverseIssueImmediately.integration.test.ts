import { describeTaxInvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxInvoiceIntegration('popbill tax-invoice integration: requestReverseIssueImmediately', () => {
  test('requestReverseIssueImmediately succeeds', async () => {
    const context = testkit.createTaxInvoiceMethodContext()
    const managementKey = testkit.createManagementKey('RIM')

    testkit.expectApiSuccess(
      await context.service.requestReverseIssueImmediately({
        businessNumber: context.businessNumber,
        taxInvoiceDocument: testkit.createTaxInvoiceDocument({
          businessNumber: context.businessNumber,
          counterpartCorpNum: context.env.counterpartCorpNum,
          managementKey,
          writeDate: context.today,
          receiverEmail: context.env.receiverEmail,
          issueType: '역발행',
        }),
        historyMemo: 'integration reverse immediate request',
      })
    )
  }, 180_000)
})
