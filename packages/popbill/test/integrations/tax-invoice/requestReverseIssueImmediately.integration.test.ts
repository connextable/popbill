import { describeTaxInvoiceIntegration } from './integration-context'
import { TaxInvoiceIssueTypes } from '@/services/tax-invoice/types'
import * as testkit from './method-testkit'

describeTaxInvoiceIntegration('popbill tax-invoice integration: requestReverseIssueImmediately', () => {
  test('requestReverseIssueImmediately succeeds', async () => {
    const context = testkit.createTaxInvoiceMethodContext()
    const managementKey = testkit.createManagementKey('RIM')

    testkit.expectApiSuccess(
      await context.service.requestReverseIssueImmediately({
        businessNumber: context.businessNumber,
        taxInvoiceDocument: testkit.createTaxInvoiceDocument({
          businessNumber: context.businessNumber,
          counterpartBusinessNumber: context.env.counterpartCorpNum,
          managementKey,
          writtenDate: context.today,
          receiverEmail: context.env.receiverEmail,
          issueType: TaxInvoiceIssueTypes.Reverse,
        }),
        historyMemo: 'integration reverse immediate request',
      })
    )
  }, 180_000)
})
