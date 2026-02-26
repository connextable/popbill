import { TaxInvoiceBoxScopes } from '@/services/tax-invoice'
import {
  createTaxInvoiceIntegrationClient,
  describeTaxInvoiceIntegration,
  getTaxInvoiceIntegrationEnv,
} from './integration-context'

const integrationEnv = getTaxInvoiceIntegrationEnv()

describeTaxInvoiceIntegration('popbill tax-invoice integration: getTaxInvoiceBoxURL', () => {
  test('returns a document box URL', async () => {
    const client = createTaxInvoiceIntegrationClient()

    const response = await client.services.taxInvoice.getTaxInvoiceBoxURL(
      {
        businessNumber: integrationEnv.corpNum,
        taxInvoiceBoxScope: TaxInvoiceBoxScopes.TemporaryDocumentBox,
      },
      {
        userId: integrationEnv.userId,
      }
    )

    expect(typeof response).toBe('string')
    expect(response.startsWith('http')).toBe(true)
  }, 60_000)
})
