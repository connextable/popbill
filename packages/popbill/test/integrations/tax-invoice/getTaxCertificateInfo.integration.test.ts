import { describeTaxInvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxInvoiceIntegration('popbill tax-invoice integration: getTaxCertificateInfo', () => {
  test('getTaxCertificateInfo succeeds', async () => {
    const context = testkit.createTaxInvoiceMethodContext()
    const response = await context.service.getTaxCertificateInfo({
      businessNumber: context.businessNumber,
    })

    expect(typeof response).toBe('object')
    expect(response).toBeDefined()
  }, 180_000)
})
