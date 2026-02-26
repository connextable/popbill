import { describeTaxInvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxInvoiceIntegration('popbill tax-invoice integration: attachFileFromPath', () => {
  test('attachFileFromPath succeeds', async () => {
    const context = testkit.createTaxInvoiceMethodContext()
    const managementKey = await testkit.createDraftInvoice(context, 'AFP')
    const filePath = await testkit.createTempFilePath('path')

    testkit.expectApiSuccess(
      await context.service.attachFileFromPath({
        businessNumber: context.businessNumber,
        invoiceDocumentKeyType: context.invoiceDocumentKeyType,
        invoiceManagementKey: managementKey,
        displayName: 'integration-path-file.txt',
        filePath,
      })
    )
  }, 180_000)
})
