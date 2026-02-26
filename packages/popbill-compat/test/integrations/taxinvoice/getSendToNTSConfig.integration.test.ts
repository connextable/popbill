import { describeTaxinvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxinvoiceIntegration('taxinvoice compat integration: getSendToNTSConfig', () => {
  test('getSendToNTSConfig succeeds', async () => {
    const context = testkit.createTaxinvoiceMethodContext()
    const response = await context.service.getSendToNTSConfig(context.businessNumber, context.userId)

    expect(typeof response).toBe('object')
    expect(response).toHaveProperty('sendToNTS')
  }, 180_000)
})
