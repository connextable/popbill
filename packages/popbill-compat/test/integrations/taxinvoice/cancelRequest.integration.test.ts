import { describeTaxinvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxinvoiceIntegration('taxinvoice compat integration: cancelRequest', () => {
  test('cancelRequest succeeds', async () => {
    const context = testkit.createTaxinvoiceMethodContext()
    const keys = await testkit.createReverseRequestedInvoice(context, 'RCR')

    testkit.expectApiSuccess(
      await context.service.cancelRequest(
        context.businessNumber,
        'BUY',
        keys.requestManagementKey,
        'integration reverse request cancel',
        context.userId
      )
    )
  }, 180_000)
})
