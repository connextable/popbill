import { describeTaxinvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxinvoiceIntegration('taxinvoice compat integration: getXML', () => {
  test('getXML succeeds', async () => {
    const context = testkit.createTaxinvoiceMethodContext()
    const managementKey = await testkit.createDraftInvoice(context, 'XML')

    const response = await context.service.getXML(context.businessNumber, context.invoiceDocumentKeyType, managementKey, context.userId)

    expect(typeof response.code).toBe('number')
    expect(typeof response.retObject).toBe('string')
  }, 180_000)
})
