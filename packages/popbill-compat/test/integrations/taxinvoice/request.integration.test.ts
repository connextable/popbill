import { describeTaxinvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxinvoiceIntegration('taxinvoice compat integration: request', () => {
  test('request succeeds', async () => {
    const context = testkit.createTaxinvoiceMethodContext()
    const managementKey = await testkit.createReverseDraftInvoice(context, 'RRQ')

    testkit.expectApiSuccess(
      await context.service.request(
        context.businessNumber,
        context.invoiceDocumentKeyType,
        managementKey,
        'integration reverse request',
        context.userId
      )
    )
  }, 180_000)
})
