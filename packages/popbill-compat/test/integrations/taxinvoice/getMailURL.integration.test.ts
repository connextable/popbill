import { describeTaxinvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxinvoiceIntegration('taxinvoice compat integration: getMailURL', () => {
  test('getMailURL succeeds', async () => {
    const context = testkit.createTaxinvoiceMethodContext()
    const managementKey = await testkit.createIssuedInvoice(context, 'MLU')

    const response = await context.service.getMailURL(
      context.businessNumber,
      context.invoiceDocumentKeyType,
      managementKey,
      context.userId
    )

    expect(typeof response).toBe('string')
    expect(response.startsWith('http')).toBe(true)
  }, 180_000)
})
