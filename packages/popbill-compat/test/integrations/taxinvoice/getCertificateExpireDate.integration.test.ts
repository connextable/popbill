import { describeTaxinvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxinvoiceIntegration('taxinvoice compat integration: getCertificateExpireDate', () => {
  test('getCertificateExpireDate succeeds', async () => {
    const context = testkit.createTaxinvoiceMethodContext()
    const response = await context.service.getCertificateExpireDate(context.businessNumber, context.userId)

    expect(typeof response).toBe('string')
    expect(response.length).toBeGreaterThan(0)
  }, 180_000)
})
