import { describeTaxInvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxInvoiceIntegration('popbill tax-invoice integration: attachInvoiceStatement', () => {
  test('attachInvoiceStatement succeeds', async () => {
    const context = testkit.createTaxInvoiceMethodContext()
    const managementKey = await testkit.createDraftInvoice(context, 'AST')

    testkit.expectApiSuccess(
      await context.service.attachInvoiceStatement({
        businessNumber: context.businessNumber,
        invoiceDocumentKeyType: context.invoiceDocumentKeyType,
        invoiceManagementKey: managementKey,
        statementItemCode: context.env.statementItemCode,
        statementManagementKey: context.env.statementManagementKey,
      })
    )
  }, 180_000)
})
