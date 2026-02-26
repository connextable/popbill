import { describeTaxInvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxInvoiceIntegration('popbill tax-invoice integration: checkInvoiceManagementKeyInUse', () => {
  test('checkInvoiceManagementKeyInUse succeeds', async () => {
    const context = testkit.createTaxInvoiceMethodContext()
    const managementKey = await testkit.createDraftInvoice(context, 'CHK')

    const inUse = await context.service.checkInvoiceManagementKeyInUse({
      businessNumber: context.businessNumber,
      invoiceDocumentKeyType: context.invoiceDocumentKeyType,
      invoiceManagementKey: managementKey,
    })

    expect(inUse).toBe(true)
  }, 180_000)
})
