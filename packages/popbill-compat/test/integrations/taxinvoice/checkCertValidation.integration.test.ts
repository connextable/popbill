import { describeTaxinvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxinvoiceIntegration('taxinvoice compat integration: checkCertValidation', () => {
  test('checkCertValidation succeeds', async () => {
    const context = testkit.createTaxinvoiceMethodContext()
    testkit.expectApiSuccess(await context.service.checkCertValidation(context.businessNumber, context.userId))
  }, 180_000)
})
