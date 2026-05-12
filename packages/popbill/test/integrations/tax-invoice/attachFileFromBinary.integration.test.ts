import { describeTaxInvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxInvoiceIntegration('popbill tax-invoice integration: attachFileFromBinary', () => {
  test('attachFileFromBinary succeeds', async () => {
    const context = testkit.createTaxInvoiceMethodContext()
    const managementKey = await testkit.createDraftInvoice(context, 'AFB')

    testkit.expectApiSuccess(
      await context.service.attachFileFromBinary({
        businessNumber: context.businessNumber,
        invoiceDocumentKeyType: context.invoiceDocumentKeyType,
        invoiceManagementKey: managementKey,
        fileName: 'integration-binary-file.txt',
        fileData: Buffer.from(`integration binary ${managementKey}`, 'utf8'),
      })
    )
  }, 180_000)
})
