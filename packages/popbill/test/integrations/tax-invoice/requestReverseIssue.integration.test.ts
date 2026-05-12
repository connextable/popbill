import { describeTaxInvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxInvoiceIntegration('popbill tax-invoice integration: requestReverseIssue', () => {
  test('requestReverseIssue succeeds', async () => {
    const context = testkit.createTaxInvoiceMethodContext()
    const keys = await testkit.createReverseDraftInvoiceKeys(context, 'RRQ')

    testkit.expectApiSuccess(
      await context.service.requestReverseIssue({
        businessNumber: context.businessNumber,
        invoiceDocumentKeyType: 'BUY',
        invoiceManagementKey: keys.requestManagementKey,
        historyMemo: 'integration reverse request',
      })
    )
  }, 180_000)
})
