import { describeTaxinvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxinvoiceIntegration('taxinvoice compat integration: assignMgtKey', () => {
  test('assignMgtKey succeeds', async () => {
    const context = testkit.createTaxinvoiceMethodContext()
    const managementKey = await testkit.createDraftInvoice(context, 'AMK')
    const info = await context.service.getInfo(
      context.businessNumber,
      context.invoiceDocumentKeyType,
      managementKey,
      context.userId
    )

    testkit.expectApiSuccess(
      await context.service.assignMgtKey(
        context.businessNumber,
        context.invoiceDocumentKeyType,
        info.itemKey,
        testkit.createManagementKey('NEW'),
        context.userId
      )
    )
  }, 180_000)
})
