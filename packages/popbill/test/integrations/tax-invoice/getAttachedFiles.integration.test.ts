import { describeTaxInvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxInvoiceIntegration('popbill tax-invoice integration: getAttachedFiles', () => {
  test('getAttachedFiles succeeds', async () => {
    const context = testkit.createTaxInvoiceMethodContext()
    const managementKey = await testkit.createDraftInvoice(context, 'GAF')
    await testkit.attachFileAndFindIdentifier(context, managementKey)

    const response = await context.service.getAttachedFiles({
      businessNumber: context.businessNumber,
      invoiceDocumentKeyType: context.invoiceDocumentKeyType,
      invoiceManagementKey: managementKey,
    })

    expect(Array.isArray(response)).toBe(true)
    expect(response.length).toBeGreaterThan(0)
  }, 180_000)
})
