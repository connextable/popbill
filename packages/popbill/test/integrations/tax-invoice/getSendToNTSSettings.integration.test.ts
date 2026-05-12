import { describeTaxInvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxInvoiceIntegration('popbill tax-invoice integration: getSendToNTSSettings', () => {
  test('getSendToNTSSettings succeeds', async () => {
    const context = testkit.createTaxInvoiceMethodContext()
    const response = await context.service.getSendToNTSSettings({
      businessNumber: context.businessNumber,
    })

    expect(typeof response).toBe('object')
    expect(response).toHaveProperty('sendToNationalTaxServiceEnabled')
  }, 180_000)
})
