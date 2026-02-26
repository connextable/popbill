import { describeTaxInvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxInvoiceIntegration('popbill tax-invoice integration: detachInvoiceStatement', () => {
  test('detachInvoiceStatement succeeds', async () => {
    const context = testkit.createTaxInvoiceMethodContext()
    const managementKey = await testkit.createDraftInvoice(context, 'DST')

    testkit.expectApiSuccess(
      await context.service.attachInvoiceStatement({
        businessNumber: context.businessNumber,
        invoiceDocumentKeyType: context.invoiceDocumentKeyType,
        invoiceManagementKey: managementKey,
        statementItemCode: context.env.statementItemCode,
        statementManagementKey: context.env.statementManagementKey,
      })
    )

    testkit.expectApiSuccess(
      await context.service.detachInvoiceStatement({
        businessNumber: context.businessNumber,
        invoiceDocumentKeyType: context.invoiceDocumentKeyType,
        invoiceManagementKey: managementKey,
        statementItemCode: context.env.statementItemCode,
        statementManagementKey: context.env.statementManagementKey,
      })
    )
  }, 180_000)
})
