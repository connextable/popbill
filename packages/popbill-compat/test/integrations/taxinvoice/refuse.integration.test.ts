import { describeTaxinvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxinvoiceIntegration('taxinvoice compat integration: refuse', () => {
  test('refuse succeeds', async () => {
    const context = testkit.createTaxinvoiceMethodContext()
    const keys = await testkit.createReverseRequestedInvoice(context, 'RRF')

    testkit.expectApiSuccess(
      await context.service.refuse(context.businessNumber, 'SELL', keys.refuseManagementKey, 'integration reverse request refuse', context.userId)
    )
  }, 180_000)
})
