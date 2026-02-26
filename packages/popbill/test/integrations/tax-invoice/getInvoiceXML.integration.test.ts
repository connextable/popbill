import { describeTaxInvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxInvoiceIntegration('popbill tax-invoice integration: getInvoiceXML', () => {
  test('getInvoiceXML succeeds', async () => {
    const context = testkit.createTaxInvoiceMethodContext()
    const managementKey = await testkit.createDraftInvoice(context, 'XML')

    const response = await context.service.getInvoiceXML({
      businessNumber: context.businessNumber,
      invoiceDocumentKeyType: context.invoiceDocumentKeyType,
      invoiceManagementKey: managementKey,
    })

    expect(typeof response.code).toBe('number')
    expect(typeof response.retObject).toBe('string')
  }, 180_000)
})
