import { describeTaxinvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxinvoiceIntegration('taxinvoice compat integration: deleteFile', () => {
  test('deleteFile succeeds', async () => {
    const context = testkit.createTaxinvoiceMethodContext()
    const managementKey = await testkit.createDraftInvoice(context, 'DAF')
    const fileIdentifier = await testkit.attachFileAndFindIdentifier(context, managementKey)

    testkit.expectApiSuccess(
      await context.service.deleteFile(
        context.businessNumber,
        context.invoiceDocumentKeyType,
        managementKey,
        fileIdentifier,
        context.userId
      )
    )
  }, 180_000)
})
