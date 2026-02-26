import { describeTaxinvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxinvoiceIntegration('taxinvoice compat integration: update', () => {
  test('update succeeds', async () => {
    const context = testkit.createTaxinvoiceMethodContext()
    const managementKey = testkit.createManagementKey('UPD')
    testkit.expectApiSuccess(await testkit.registerDraftInvoice(context, managementKey))

    testkit.expectApiSuccess(
      await context.service.update(
        context.businessNumber,
        context.invoiceDocumentKeyType,
        managementKey,
        testkit.createTaxInvoiceDocument({
          businessNumber: context.businessNumber,
          counterpartCorpNum: context.env.counterpartCorpNum,
          managementKey,
          writeDate: context.today,
          receiverEmail: context.env.receiverEmail,
          remark: 'updated by integration',
        }),
        context.userId
      )
    )
  }, 180_000)
})
