import { describeTaxinvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxinvoiceIntegration('taxinvoice compat integration: getSealURL', () => {
  test('getSealURL succeeds', async () => {
    const context = testkit.createTaxinvoiceMethodContext()
    const response = await context.service.getSealURL(context.businessNumber, context.userId)

    expect(typeof response.url).toBe('string')
    expect(response.url.startsWith('http')).toBe(true)
  }, 180_000)
})
