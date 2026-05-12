import { describeTaxInvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxInvoiceIntegration('popbill tax-invoice integration: registerInvoice', () => {
  test('registerInvoice succeeds', async () => {
    const context = testkit.createTaxInvoiceMethodContext()
    const managementKey = testkit.createManagementKey('REG')
    testkit.expectApiSuccess(await testkit.registerDraftInvoice(context, managementKey))
  }, 180_000)
})
