import { describeTaxInvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxInvoiceIntegration('popbill tax-invoice integration: getTaxCertificateRegistrationURL', () => {
  test('getTaxCertificateRegistrationURL succeeds', async () => {
    const context = testkit.createTaxInvoiceMethodContext()
    const response = await context.service.getTaxCertificateRegistrationURL({
      businessNumber: context.businessNumber,
    })

    expect(typeof response.accessUrl).toBe('string')
    expect(response.accessUrl.startsWith('http')).toBe(true)
  }, 180_000)
})
