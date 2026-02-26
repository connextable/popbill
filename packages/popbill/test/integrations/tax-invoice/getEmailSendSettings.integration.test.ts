import { describeTaxInvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxInvoiceIntegration('popbill tax-invoice integration: getEmailSendSettings', () => {
  test('getEmailSendSettings succeeds', async () => {
    const context = testkit.createTaxInvoiceMethodContext()
    const response = await context.service.getEmailSendSettings({
      businessNumber: context.businessNumber,
    })

    expect(Array.isArray(response)).toBe(true)
  }, 180_000)
})
