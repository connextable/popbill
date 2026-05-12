import { describeTaxInvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxInvoiceIntegration('popbill tax-invoice integration: cancelIssuedInvoice', () => {
  test('cancelIssuedInvoice succeeds', async () => {
    const context = testkit.createTaxInvoiceMethodContext()
    const managementKey = await testkit.createIssuedInvoice(context, 'CIS')

    testkit.expectApiSuccess(
      await context.service.cancelIssuedInvoice({
        businessNumber: context.businessNumber,
        invoiceDocumentKeyType: context.invoiceDocumentKeyType,
        invoiceManagementKey: managementKey,
        historyMemo: 'integration cancel issue',
      })
    )
  }, 180_000)
})
