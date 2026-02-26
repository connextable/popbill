import { describeTaxInvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxInvoiceIntegration('popbill tax-invoice integration: getInvoicePDFURL', () => {
  test('getInvoicePDFURL succeeds', async () => {
    const context = testkit.createTaxInvoiceMethodContext()
    const managementKey = await testkit.createIssuedInvoice(context, 'PDF')

    const response = await context.service.getInvoicePDFURL({
      businessNumber: context.businessNumber,
      invoiceDocumentKeyType: context.invoiceDocumentKeyType,
      invoiceManagementKey: managementKey,
    })

    expect(typeof response.accessUrl).toBe('string')
    expect(response.accessUrl.startsWith('http')).toBe(true)
  }, 180_000)
})
