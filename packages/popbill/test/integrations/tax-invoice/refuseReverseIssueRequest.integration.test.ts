import { createTaxInvoiceIntegrationClient, describeTaxInvoiceIntegration, getTaxInvoiceIntegrationEnv } from './integration-context'
import * as testkit from './method-testkit'

describeTaxInvoiceIntegration('popbill tax-invoice integration: refuseReverseIssueRequest', () => {
  test.skipIf(!getTaxInvoiceIntegrationEnv().counterpartUserId)(
    'refuseReverseIssueRequest succeeds (requires POPBILL_COUNTERPART_USER_ID)',
    async () => {
      const context = testkit.createTaxInvoiceMethodContext()
      const keys = await testkit.createReverseRequestedInvoice(context, 'RRF')
      const supplierService = createTaxInvoiceIntegrationClient(context.env.counterpartUserId).services.taxInvoice

      testkit.expectApiSuccess(
        await supplierService.refuseReverseIssueRequest({
          businessNumber: context.env.counterpartCorpNum,
          invoiceDocumentKeyType: 'SELL',
          invoiceManagementKey: keys.refuseManagementKey,
          historyMemo: 'integration reverse request refuse',
        })
      )
    },
    180_000
  )
})
