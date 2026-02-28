import { describeTaxinvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxinvoiceIntegration('taxinvoice compat integration: getDetailInfo', () => {
  test('getDetailInfo succeeds', async () => {
    const context = testkit.createTaxinvoiceMethodContext()
    const managementKey = await testkit.createDraftInvoice(context, 'GDI')

    const response = await context.service.getDetailInfo(context.businessNumber, context.invoiceDocumentKeyType, managementKey, context.userId)

    expect(typeof response).toBe('object')
  }, 180_000)
})
