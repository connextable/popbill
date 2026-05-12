import { describeTaxinvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxinvoiceIntegration('taxinvoice compat integration: getTaxCertURL', () => {
  test('getTaxCertURL succeeds', async () => {
    const context = testkit.createTaxinvoiceMethodContext()
    const response = await context.service.getTaxCertURL(context.businessNumber, context.userId)

    expect(typeof response.url).toBe('string')
    expect(response.url.startsWith('http')).toBe(true)
  }, 180_000)
})
