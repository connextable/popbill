import { describeTaxinvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxinvoiceIntegration('taxinvoice compat integration: register', () => {
  test('register succeeds', async () => {
    const context = testkit.createTaxinvoiceMethodContext()
    const managementKey = testkit.createManagementKey('REG')
    testkit.expectApiSuccess(await testkit.registerDraftInvoice(context, managementKey))
  }, 180_000)
})
