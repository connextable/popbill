import { describeTaxinvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxinvoiceIntegration('taxinvoice compat integration: cancelIssue', () => {
  test('cancelIssue succeeds', async () => {
    const context = testkit.createTaxinvoiceMethodContext()
    const managementKey = await testkit.createIssuedInvoice(context, 'CIS')

    testkit.expectApiSuccess(
      await context.service.cancelIssue(
        context.businessNumber,
        context.invoiceDocumentKeyType,
        managementKey,
        'integration cancel issue',
        context.userId
      )
    )
  }, 180_000)
})
