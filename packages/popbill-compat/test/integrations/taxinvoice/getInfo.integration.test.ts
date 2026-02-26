import { describeTaxinvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxinvoiceIntegration('taxinvoice compat integration: getInfo', () => {
  test('getInfo succeeds', async () => {
    const context = testkit.createTaxinvoiceMethodContext()
    const managementKey = await testkit.createDraftInvoice(context, 'GIN')

    const response = await context.service.getInfo(
      context.businessNumber,
      context.invoiceDocumentKeyType,
      managementKey,
      context.userId
    )

    expect(typeof response.itemKey).toBe('string')
    expect(response.itemKey.length).toBeGreaterThan(0)
  }, 180_000)
})
