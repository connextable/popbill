import { describeTaxInvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxInvoiceIntegration('popbill tax-invoice integration: resendInvoiceFAX', () => {
  test('resendInvoiceFAX succeeds', async () => {
    const context = testkit.createTaxInvoiceMethodContext()
    const managementKey = await testkit.createIssuedInvoice(context, 'FAX')

    testkit.expectApiSuccess(
      await context.service.resendInvoiceFAX({
        businessNumber: context.businessNumber,
        invoiceDocumentKeyType: context.invoiceDocumentKeyType,
        invoiceManagementKey: managementKey,
        senderNumber: context.env.senderFaxNumber,
        receiverNumber: context.env.receiverFaxNumber,
      })
    )
  }, 180_000)
})
