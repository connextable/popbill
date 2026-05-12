import { describeTaxInvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxInvoiceIntegration('popbill tax-invoice integration: checkTaxCertificateValidation', () => {
  test('checkTaxCertificateValidation succeeds', async () => {
    const context = testkit.createTaxInvoiceMethodContext()
    testkit.expectApiSuccess(
      await context.service.checkTaxCertificateValidation({
        businessNumber: context.businessNumber,
      })
    )
  }, 180_000)
})
