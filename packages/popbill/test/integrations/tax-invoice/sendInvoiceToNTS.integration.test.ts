import { describeTaxInvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxInvoiceIntegration('popbill tax-invoice integration: sendInvoiceToNTS', () => {
  test('sendInvoiceToNTS succeeds', async () => {
    const context = testkit.createTaxInvoiceMethodContext()
    const managementKey = await testkit.createIssuedInvoice(context, 'NTS')

    testkit.expectApiSuccess(
      await context.service.sendInvoiceToNTS({
        businessNumber: context.businessNumber,
        invoiceDocumentKeyType: context.invoiceDocumentKeyType,
        invoiceManagementKey: managementKey,
      })
    )
  }, 180_000)
})
