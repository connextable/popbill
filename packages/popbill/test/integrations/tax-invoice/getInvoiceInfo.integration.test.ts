import { describeTaxInvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxInvoiceIntegration('popbill tax-invoice integration: getInvoiceInfo', () => {
  test('getInvoiceInfo succeeds', async () => {
    const context = testkit.createTaxInvoiceMethodContext()
    const managementKey = await testkit.createDraftInvoice(context, 'GIN')

    const response = await context.service.getInvoiceInfo({
      businessNumber: context.businessNumber,
      invoiceDocumentKeyType: context.invoiceDocumentKeyType,
      invoiceManagementKey: managementKey,
    })

    expect(typeof response.itemKey).toBe('string')
    expect(response.itemKey.length).toBeGreaterThan(0)
  }, 180_000)
})
