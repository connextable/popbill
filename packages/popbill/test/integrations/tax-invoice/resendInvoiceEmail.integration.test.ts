import { describeTaxInvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxInvoiceIntegration('popbill tax-invoice integration: resendInvoiceEmail', () => {
  test('resendInvoiceEmail succeeds', async () => {
    const context = testkit.createTaxInvoiceMethodContext()
    const managementKey = await testkit.createIssuedInvoice(context, 'EML')

    testkit.expectApiSuccess(
      await context.service.resendInvoiceEmail({
        businessNumber: context.businessNumber,
        invoiceDocumentKeyType: context.invoiceDocumentKeyType,
        invoiceManagementKey: managementKey,
        receiverEmailAddress: context.env.receiverEmail,
      })
    )
  }, 180_000)
})
