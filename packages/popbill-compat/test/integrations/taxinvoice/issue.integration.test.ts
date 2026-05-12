import { describeTaxinvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxinvoiceIntegration('taxinvoice compat integration: issue', () => {
  test('issue succeeds', async () => {
    const context = testkit.createTaxinvoiceMethodContext()
    const managementKey = await testkit.createDraftInvoice(context, 'ISS')

    testkit.expectApiSuccess(
      await context.service.issue(
        context.businessNumber,
        context.invoiceDocumentKeyType,
        managementKey,
        'integration issue',
        'integration issue',
        false,
        context.userId
      )
    )
  }, 180_000)
})
