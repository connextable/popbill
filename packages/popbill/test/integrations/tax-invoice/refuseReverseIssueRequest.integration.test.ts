import { describeTaxInvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxInvoiceIntegration('popbill tax-invoice integration: refuseReverseIssueRequest', () => {
  test('refuseReverseIssueRequest succeeds', async () => {
    const context = testkit.createTaxInvoiceMethodContext()
    const keys = await testkit.createReverseRequestedInvoice(context, 'RRF')

    testkit.expectApiSuccess(
      await context.service.refuseReverseIssueRequest({
        businessNumber: context.businessNumber,
        invoiceDocumentKeyType: 'SELL',
        invoiceManagementKey: keys.refuseManagementKey,
        historyMemo: 'integration reverse request refuse',
      })
    )
  }, 180_000)
})
