import { describeTaxInvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxInvoiceIntegration('popbill tax-invoice integration: getInvoicesInfo', () => {
  test('getInvoicesInfo succeeds', async () => {
    const context = testkit.createTaxInvoiceMethodContext()
    const managementKey = await testkit.createDraftInvoice(context, 'GIS')

    const response = await context.service.getInvoicesInfo({
      businessNumber: context.businessNumber,
      invoiceDocumentKeyType: context.invoiceDocumentKeyType,
      invoiceManagementKeys: [managementKey],
    })

    expect(Array.isArray(response)).toBe(true)
    expect(response.length).toBeGreaterThan(0)
  }, 180_000)
})
