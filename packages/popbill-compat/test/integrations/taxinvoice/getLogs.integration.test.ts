import { describeTaxinvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxinvoiceIntegration('taxinvoice compat integration: getLogs', () => {
  test('getLogs succeeds', async () => {
    const context = testkit.createTaxinvoiceMethodContext()
    const managementKey = await testkit.createDraftInvoice(context, 'LOG')

    const response = await context.service.getLogs(
      context.businessNumber,
      context.invoiceDocumentKeyType,
      managementKey,
      context.userId
    )

    expect(Array.isArray(response)).toBe(true)
  }, 180_000)
})
