import { describeTaxinvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxinvoiceIntegration('taxinvoice compat integration: getURL', () => {
  test('getURL succeeds', async () => {
    const context = testkit.createTaxinvoiceMethodContext()
    const response = await context.service.getURL(context.businessNumber, 'TBOX', context.userId)

    expect(typeof response).toBe('string')
    expect(response.startsWith('http')).toBe(true)
  }, 180_000)
})
