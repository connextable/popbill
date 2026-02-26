import { describeTaxinvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxinvoiceIntegration('taxinvoice compat integration: getTaxCertInfo', () => {
  test('getTaxCertInfo succeeds', async () => {
    const context = testkit.createTaxinvoiceMethodContext()
    const response = await context.service.getTaxCertInfo(context.businessNumber, context.userId)

    expect(typeof response).toBe('object')
    expect(response).toBeDefined()
  }, 180_000)
})
