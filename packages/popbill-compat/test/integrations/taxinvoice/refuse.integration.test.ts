import { describeTaxinvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxinvoiceIntegration('taxinvoice compat integration: refuse', () => {
  test('refuse succeeds', async () => {
    const context = testkit.createTaxinvoiceMethodContext()
    const managementKey = await testkit.createReverseRequestedInvoice(context, 'RRF')

    testkit.expectApiSuccess(
      await context.service.refuse(
        context.businessNumber,
        context.invoiceDocumentKeyType,
        managementKey,
        'integration reverse request refuse',
        context.userId
      )
    )
  }, 180_000)
})
