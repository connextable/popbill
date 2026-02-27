import { createCoreRequestClient, describeCoreIntegration, getCoreIntegrationEnv } from './integration-context'

const integrationEnv = getCoreIntegrationEnv()

describeCoreIntegration('popbill-compat integration: requestJson', () => {
  test('calls real test Taxinvoice API with issued token', async () => {
    const requestClient = createCoreRequestClient()

    const response = await requestClient.requestJson<{ url: string }>({
      uri: '/Taxinvoice?TG=TBOX',
      method: 'GET',
      corpNum: integrationEnv.corpNum,
      userId: integrationEnv.userId,
    })

    expect(typeof response.url).toBe('string')
    expect(response.url.startsWith('http')).toBe(true)
  }, 60_000)
})
