import { describeTaxInvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxInvoiceIntegration('popbill tax-invoice integration: updateEmailSendSettings', () => {
  test('updateEmailSendSettings succeeds', async () => {
    const context = testkit.createTaxInvoiceMethodContext()
    const settings = await context.service.getEmailSendSettings({
      businessNumber: context.businessNumber,
    })
    const emailType =
      settings.find((setting) => typeof setting.emailTypeCode === 'string')?.emailTypeCode ?? 'TAX_ISSUE'

    testkit.expectApiSuccess(
      await context.service.updateEmailSendSettings({
        businessNumber: context.businessNumber,
        emailType,
        sendEnabled: true,
      })
    )
  }, 180_000)
})
