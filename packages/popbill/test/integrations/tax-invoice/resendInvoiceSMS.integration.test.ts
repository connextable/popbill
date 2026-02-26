import { describeTaxInvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxInvoiceIntegration('popbill tax-invoice integration: resendInvoiceSMS', () => {
  test('resendInvoiceSMS succeeds', async () => {
    const context = testkit.createTaxInvoiceMethodContext()
    const managementKey = await testkit.createIssuedInvoice(context, 'SMS')

    testkit.expectApiSuccess(
      await context.service.resendInvoiceSMS({
        businessNumber: context.businessNumber,
        invoiceDocumentKeyType: context.invoiceDocumentKeyType,
        invoiceManagementKey: managementKey,
        senderPhoneNumber: context.env.senderPhoneNumber,
        receiverPhoneNumber: context.env.receiverPhoneNumber,
        messageBody: 'integration sms resend',
      })
    )
  }, 180_000)
})
