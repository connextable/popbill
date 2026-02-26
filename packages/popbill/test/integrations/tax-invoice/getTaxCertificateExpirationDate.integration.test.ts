import { describeTaxInvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxInvoiceIntegration('popbill tax-invoice integration: getTaxCertificateExpirationDate', () => {
  test('getTaxCertificateExpirationDate succeeds', async () => {
    const context = testkit.createTaxInvoiceMethodContext()
    const response = await context.service.getTaxCertificateExpirationDate({
      businessNumber: context.businessNumber,
    })

    expect(typeof response).toBe('string')
    expect(response.length).toBeGreaterThan(0)
  }, 180_000)
})
