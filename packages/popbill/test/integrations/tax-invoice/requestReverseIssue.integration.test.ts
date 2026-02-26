import { describeTaxInvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxInvoiceIntegration('popbill tax-invoice integration: requestReverseIssue', () => {
  test('requestReverseIssue succeeds', async () => {
    const context = testkit.createTaxInvoiceMethodContext()
    const managementKey = await testkit.createReverseDraftInvoice(context, 'RRQ')

    testkit.expectApiSuccess(
      await context.service.requestReverseIssue({
        businessNumber: context.businessNumber,
        invoiceDocumentKeyType: context.invoiceDocumentKeyType,
        invoiceManagementKey: managementKey,
        historyMemo: 'integration reverse request',
      })
    )
  }, 180_000)
})
