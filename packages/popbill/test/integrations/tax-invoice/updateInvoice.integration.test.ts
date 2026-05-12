import { describeTaxInvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxInvoiceIntegration('popbill tax-invoice integration: updateInvoice', () => {
  test('updateInvoice succeeds', async () => {
    const context = testkit.createTaxInvoiceMethodContext()
    const managementKey = testkit.createManagementKey('UPD')
    testkit.expectApiSuccess(await testkit.registerDraftInvoice(context, managementKey))

    testkit.expectApiSuccess(
      await context.service.updateInvoice({
        businessNumber: context.businessNumber,
        invoiceDocumentKeyType: context.invoiceDocumentKeyType,
        invoiceManagementKey: managementKey,
        taxInvoiceDocument: testkit.createTaxInvoiceDocument({
          businessNumber: context.businessNumber,
          counterpartBusinessNumber: context.env.counterpartCorpNum,
          managementKey,
          writtenDate: context.today,
          receiverEmail: context.env.receiverEmail,
          remark: 'updated by integration',
        }),
      })
    )
  }, 180_000)
})
