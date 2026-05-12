import { describeTaxInvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxInvoiceIntegration('popbill tax-invoice integration: assignInvoiceManagementKey', () => {
  test('assignInvoiceManagementKey succeeds', async () => {
    const context = testkit.createTaxInvoiceMethodContext()
    const managementKey = await testkit.createDraftInvoice(context, 'AMK')
    const info = await context.service.getInvoiceInfo({
      businessNumber: context.businessNumber,
      invoiceDocumentKeyType: context.invoiceDocumentKeyType,
      invoiceManagementKey: managementKey,
    })

    testkit.expectApiSuccess(
      await context.service.assignInvoiceManagementKey({
        businessNumber: context.businessNumber,
        invoiceDocumentKeyType: context.invoiceDocumentKeyType,
        itemKey: info.itemKey,
        invoiceManagementKey: testkit.createManagementKey('NEW'),
      })
    )
  }, 180_000)
})
