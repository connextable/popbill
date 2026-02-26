import { describeTaxinvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxinvoiceIntegration('taxinvoice compat integration: sendEmail', () => {
  test('sendEmail succeeds', async () => {
    const context = testkit.createTaxinvoiceMethodContext()
    const managementKey = await testkit.createIssuedInvoice(context, 'EML')

    testkit.expectApiSuccess(
      await context.service.sendEmail(
        context.businessNumber,
        context.invoiceDocumentKeyType,
        managementKey,
        context.env.receiverEmail,
        context.userId
      )
    )
  }, 180_000)
})
