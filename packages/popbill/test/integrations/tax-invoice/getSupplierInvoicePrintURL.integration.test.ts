import { describeTaxInvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxInvoiceIntegration('popbill tax-invoice integration: getSupplierInvoicePrintURL', () => {
  test('getSupplierInvoicePrintURL succeeds', async () => {
    const context = testkit.createTaxInvoiceMethodContext()
    const managementKey = await testkit.createIssuedInvoice(context, 'SUP')

    const response = await context.service.getSupplierInvoicePrintURL({
      businessNumber: context.businessNumber,
      invoiceDocumentKeyType: context.invoiceDocumentKeyType,
      invoiceManagementKey: managementKey,
    })

    expect(typeof response.accessUrl).toBe('string')
    expect(response.accessUrl.startsWith('http')).toBe(true)
  }, 180_000)
})
