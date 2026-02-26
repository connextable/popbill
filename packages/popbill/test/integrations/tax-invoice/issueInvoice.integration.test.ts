import { describeTaxInvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxInvoiceIntegration('popbill tax-invoice integration: issueInvoice', () => {
  test('issueInvoice succeeds', async () => {
    const context = testkit.createTaxInvoiceMethodContext()
    const managementKey = await testkit.createDraftInvoice(context, 'ISS')

    testkit.expectApiSuccess(
      await context.service.issueInvoice({
        businessNumber: context.businessNumber,
        invoiceDocumentKeyType: context.invoiceDocumentKeyType,
        invoiceManagementKey: managementKey,
        historyMemo: 'integration issue',
        emailSubject: 'integration issue',
        forceIssue: false,
      })
    )
  }, 180_000)
})
