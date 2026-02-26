import { describeTaxinvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxinvoiceIntegration('taxinvoice compat integration: listEmailConfig', () => {
  test('listEmailConfig succeeds', async () => {
    const context = testkit.createTaxinvoiceMethodContext()
    const response = await context.service.listEmailConfig(context.businessNumber, context.userId)

    expect(Array.isArray(response)).toBe(true)
  }, 180_000)
})
