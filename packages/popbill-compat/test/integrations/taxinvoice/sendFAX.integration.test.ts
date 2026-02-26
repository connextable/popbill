import { describeTaxinvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxinvoiceIntegration('taxinvoice compat integration: sendFAX', () => {
  test('sendFAX succeeds', async () => {
    const context = testkit.createTaxinvoiceMethodContext()
    const managementKey = await testkit.createIssuedInvoice(context, 'FAX')

    testkit.expectApiSuccess(
      await context.service.sendFAX(
        context.businessNumber,
        context.invoiceDocumentKeyType,
        managementKey,
        context.env.senderFaxNumber,
        context.env.receiverFaxNumber,
        context.userId
      )
    )
  }, 180_000)
})
