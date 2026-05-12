import { describeTaxInvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxInvoiceIntegration('popbill tax-invoice integration: getTaxInvoiceBoxURL', () => {
  test('getTaxInvoiceBoxURL succeeds', async () => {
    const context = testkit.createTaxInvoiceMethodContext()
    const response = await context.service.getTaxInvoiceBoxURL({
      businessNumber: context.businessNumber,
      taxInvoiceBoxScope: 'TBOX',
    })

    expect(typeof response.accessUrl).toBe('string')
    expect(response.accessUrl.startsWith('http')).toBe(true)
  }, 180_000)
})
