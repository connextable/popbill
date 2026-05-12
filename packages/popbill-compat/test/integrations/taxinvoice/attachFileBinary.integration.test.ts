import { describeTaxinvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxinvoiceIntegration('taxinvoice compat integration: attachFileBinary', () => {
  test('attachFileBinary succeeds', async () => {
    const context = testkit.createTaxinvoiceMethodContext()
    const managementKey = await testkit.createDraftInvoice(context, 'AFB')

    testkit.expectApiSuccess(
      await context.service.attachFileBinary(
        context.businessNumber,
        context.invoiceDocumentKeyType,
        managementKey,
        {
          fileName: 'integration-binary-file.txt',
          fileData: Buffer.from(`integration binary ${managementKey}`, 'utf8'),
        },
        context.userId
      )
    )
  }, 180_000)
})
