import { describeTaxInvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxInvoiceIntegration('popbill tax-invoice integration: getBulkInvoicePrintURL', () => {
  test('getBulkInvoicePrintURL succeeds', async () => {
    const context = testkit.createTaxInvoiceMethodContext()
    const managementKey = await testkit.createIssuedInvoice(context, 'BPR')

    const response = await context.service.getBulkInvoicePrintURL({
      businessNumber: context.businessNumber,
      invoiceDocumentKeyType: context.invoiceDocumentKeyType,
      invoiceManagementKeys: [managementKey],
    })

    expect(typeof response.accessUrl).toBe('string')
    expect(response.accessUrl.startsWith('http')).toBe(true)
  }, 180_000)
})
