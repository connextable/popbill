import { describeTaxInvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxInvoiceIntegration('popbill tax-invoice integration: getSealAndAttachmentRegistrationURL', () => {
  test('getSealAndAttachmentRegistrationURL succeeds', async () => {
    const context = testkit.createTaxInvoiceMethodContext()
    const response = await context.service.getSealAndAttachmentRegistrationURL({
      businessNumber: context.businessNumber,
    })

    expect(typeof response.url).toBe('string')
    expect(response.url.startsWith('http')).toBe(true)
  }, 180_000)
})
