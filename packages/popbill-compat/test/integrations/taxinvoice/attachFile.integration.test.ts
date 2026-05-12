import { describeTaxinvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxinvoiceIntegration('taxinvoice compat integration: attachFile', () => {
  test('attachFile succeeds', async () => {
    const context = testkit.createTaxinvoiceMethodContext()
    const managementKey = await testkit.createDraftInvoice(context, 'AFP')
    const filePath = await testkit.createTempFilePath('path')

    testkit.expectApiSuccess(
      await context.service.attachFile(
        context.businessNumber,
        context.invoiceDocumentKeyType,
        managementKey,
        'integration-path-file.txt',
        filePath,
        context.userId
      )
    )
  }, 180_000)
})
