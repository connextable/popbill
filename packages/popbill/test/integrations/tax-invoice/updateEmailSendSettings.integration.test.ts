import { describeTaxInvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'
import { TaxInvoiceEmailTypes, type TaxInvoiceEmailType } from '@/services/tax-invoice/types'

describeTaxInvoiceIntegration('popbill tax-invoice integration: updateEmailSendSettings', () => {
  test('updateEmailSendSettings succeeds', async () => {
    const context = testkit.createTaxInvoiceMethodContext()
    const settings = await context.service.getEmailSendSettings({
      businessNumber: context.businessNumber,
    })
    const allowedEmailTypes = new Set<string>(Object.values(TaxInvoiceEmailTypes))
    const emailType = (settings.find(
      (setting) => typeof setting.emailTypeCode === 'string' && allowedEmailTypes.has(setting.emailTypeCode)
    )?.emailTypeCode ?? TaxInvoiceEmailTypes.TaxIssue) as TaxInvoiceEmailType

    testkit.expectApiSuccess(
      await context.service.updateEmailSendSettings({
        businessNumber: context.businessNumber,
        emailType,
        sendEnabled: true,
      })
    )
  }, 180_000)
})
