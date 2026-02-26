import { describeTaxinvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxinvoiceIntegration('taxinvoice compat integration: attachStatement', () => {
  test('attachStatement succeeds', async () => {
    const context = testkit.createTaxinvoiceMethodContext()
    const managementKey = await testkit.createDraftInvoice(context, 'AST')

    testkit.expectApiSuccess(
      await context.service.attachStatement(
        context.businessNumber,
        context.invoiceDocumentKeyType,
        managementKey,
        context.env.statementItemCode,
        context.env.statementManagementKey,
        context.userId
      )
    )
  }, 180_000)
})
