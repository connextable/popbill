import { describeTaxinvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxinvoiceIntegration('taxinvoice compat integration: getFiles', () => {
  test('getFiles succeeds', async () => {
    const context = testkit.createTaxinvoiceMethodContext()
    const managementKey = await testkit.createDraftInvoice(context, 'GAF')
    await testkit.attachFileAndFindIdentifier(context, managementKey)

    const response = await context.service.getFiles(context.businessNumber, context.invoiceDocumentKeyType, managementKey, context.userId)

    expect(Array.isArray(response)).toBe(true)
    expect(response.length).toBeGreaterThan(0)
  }, 180_000)
})
