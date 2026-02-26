import { describeTaxinvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxinvoiceIntegration('taxinvoice compat integration: sendToNTS', () => {
  test('sendToNTS succeeds', async () => {
    const context = testkit.createTaxinvoiceMethodContext()
    const managementKey = await testkit.createIssuedInvoice(context, 'NTS')

    testkit.expectApiSuccess(
      await context.service.sendToNTS(
        context.businessNumber,
        context.invoiceDocumentKeyType,
        managementKey,
        context.userId
      )
    )
  }, 180_000)
})
