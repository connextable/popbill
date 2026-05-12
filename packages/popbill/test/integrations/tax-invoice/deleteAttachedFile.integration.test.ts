import { describeTaxInvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxInvoiceIntegration('popbill tax-invoice integration: deleteAttachedFile', () => {
  test('deleteAttachedFile succeeds', async () => {
    const context = testkit.createTaxInvoiceMethodContext()
    const managementKey = await testkit.createDraftInvoice(context, 'DAF')
    const fileIdentifier = await testkit.attachFileAndFindIdentifier(context, managementKey)

    testkit.expectApiSuccess(
      await context.service.deleteAttachedFile({
        businessNumber: context.businessNumber,
        invoiceDocumentKeyType: context.invoiceDocumentKeyType,
        invoiceManagementKey: managementKey,
        fileIdentifier,
      })
    )
  }, 180_000)
})
