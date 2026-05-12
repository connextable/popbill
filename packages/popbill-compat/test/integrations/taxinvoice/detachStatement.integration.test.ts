import { describeTaxinvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxinvoiceIntegration('taxinvoice compat integration: detachStatement', () => {
  test('detachStatement succeeds', async () => {
    const context = testkit.createTaxinvoiceMethodContext()
    const managementKey = await testkit.createDraftInvoice(context, 'DST')

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

    testkit.expectApiSuccess(
      await context.service.detachStatement(
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
