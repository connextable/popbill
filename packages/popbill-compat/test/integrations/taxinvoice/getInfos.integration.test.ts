import { describeTaxinvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxinvoiceIntegration('taxinvoice compat integration: getInfos', () => {
  test('getInfos succeeds', async () => {
    const context = testkit.createTaxinvoiceMethodContext()
    const managementKey = await testkit.createDraftInvoice(context, 'GIS')

    const response = await context.service.getInfos(
      context.businessNumber,
      context.invoiceDocumentKeyType,
      [managementKey],
      context.userId
    )

    expect(Array.isArray(response)).toBe(true)
    expect(response.length).toBeGreaterThan(0)
  }, 180_000)
})
