import { describeTaxinvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxinvoiceIntegration('taxinvoice compat integration: sendSMS', () => {
  test('sendSMS succeeds', async () => {
    const context = testkit.createTaxinvoiceMethodContext()
    const managementKey = await testkit.createIssuedInvoice(context, 'SMS')

    testkit.expectApiSuccess(
      await context.service.sendSMS(
        context.businessNumber,
        context.invoiceDocumentKeyType,
        managementKey,
        context.env.senderPhoneNumber,
        context.env.receiverPhoneNumber,
        'compat integration sms resend',
        context.userId
      )
    )
  }, 180_000)
})
