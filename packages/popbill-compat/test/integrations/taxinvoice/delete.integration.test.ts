import { describeTaxinvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxinvoiceIntegration('taxinvoice compat integration: delete', () => {
  test('delete succeeds', async () => {
    const context = testkit.createTaxinvoiceMethodContext()
    const managementKey = await testkit.createDraftInvoice(context, 'DEL')

    testkit.expectApiSuccess(
      await context.service.delete(
        context.businessNumber,
        context.invoiceDocumentKeyType,
        managementKey,
        context.userId
      )
    )
  }, 180_000)
})
