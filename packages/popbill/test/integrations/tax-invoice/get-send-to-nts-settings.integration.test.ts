import {
  createTaxInvoiceIntegrationClient,
  describeTaxInvoiceIntegration,
  getTaxInvoiceIntegrationEnv,
} from './integration-context'

const integrationEnv = getTaxInvoiceIntegrationEnv()

describeTaxInvoiceIntegration('popbill tax-invoice integration: getSendToNTSSettings', () => {
  test('returns send-to-NTS configuration', async () => {
    const client = createTaxInvoiceIntegrationClient()

    const response = await client.services.taxInvoice.getSendToNTSSettings(
      {
        businessNumber: integrationEnv.corpNum,
      },
      {
        userId: integrationEnv.userId,
      }
    )

    expect(response).toBeDefined()
    expect(response).toHaveProperty('sendToNTS')
    expect(['boolean', 'string']).toContain(typeof response.sendToNTS)
  }, 60_000)
})
