import { describeTaxInvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxInvoiceIntegration('popbill tax-invoice integration: cancelReverseIssueRequest', () => {
  test('cancelReverseIssueRequest succeeds', async () => {
    const context = testkit.createTaxInvoiceMethodContext()
    const managementKey = await testkit.createReverseRequestedInvoice(context, 'RCR')

    testkit.expectApiSuccess(
      await context.service.cancelReverseIssueRequest({
        businessNumber: context.businessNumber,
        invoiceDocumentKeyType: context.invoiceDocumentKeyType,
        invoiceManagementKey: managementKey,
        historyMemo: 'integration reverse request cancel',
      })
    )
  }, 180_000)
})
