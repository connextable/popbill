import { describeTaxinvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxinvoiceIntegration('taxinvoice compat integration: checkMgtKeyInUse', () => {
  test('checkMgtKeyInUse succeeds', async () => {
    const context = testkit.createTaxinvoiceMethodContext()
    const managementKey = await testkit.createDraftInvoice(context, 'CHK')

    const inUse = await context.service.checkMgtKeyInUse(context.businessNumber, context.invoiceDocumentKeyType, managementKey, context.userId)

    expect(inUse).toBe(true)
  }, 180_000)
})
