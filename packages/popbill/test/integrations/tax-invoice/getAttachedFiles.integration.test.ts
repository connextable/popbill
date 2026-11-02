import { describeTaxInvoiceIntegration } from './integration-context'
import * as testkit from './method-testkit'

describeTaxInvoiceIntegration('popbill tax-invoice integration: getAttachedFiles', () => {
  test('getAttachedFiles returns the uploaded file identifier', async () => {
    const context = testkit.createTaxInvoiceMethodContext()
    const managementKey = await testkit.createDraftInvoice(context, 'GAF')
    await expect(testkit.attachFileAndFindIdentifier(context, managementKey)).resolves.toEqual(expect.any(String))
  }, 180_000)
})
