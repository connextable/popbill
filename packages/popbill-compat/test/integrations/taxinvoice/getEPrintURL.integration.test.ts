import { describeTaxinvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxinvoiceIntegration('taxinvoice compat integration: getEPrintURL', () => {
  test('getEPrintURL succeeds', async () => {
    const context = testkit.createTaxinvoiceMethodContext()
    const managementKey = await testkit.createIssuedInvoice(context, 'BUY')

    const response = await context.service.getEPrintURL(
      context.businessNumber,
      context.invoiceDocumentKeyType,
      managementKey,
      context.userId
    )

    expect(typeof response).toBe('string')
    expect(response.startsWith('http')).toBe(true)
  }, 180_000)
})
