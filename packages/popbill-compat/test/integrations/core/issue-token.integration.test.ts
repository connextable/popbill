import {
  createCoreAuthClient,
  describeCoreIntegration,
  getCoreIntegrationEnv,
  coreIntegrationScopes,
  coreIntegrationServiceId,
} from './integration-context'

const integrationEnv = getCoreIntegrationEnv()

describeCoreIntegration('popbill-compat integration: issueToken', () => {
  test('issues a real test token from Linkhub', async () => {
    const authClient = createCoreAuthClient()

    const issuedToken = await authClient.issueToken({
      serviceId: coreIntegrationServiceId,
      accessId: integrationEnv.corpNum,
      scopes: [...coreIntegrationScopes],
    })

    const expiresAt = Date.parse(issuedToken.expiredAt)

    expect(issuedToken.serviceId).toBe(coreIntegrationServiceId)
    expect(issuedToken.sessionToken.length).toBeGreaterThan(0)
    expect(Number.isNaN(expiresAt)).toBe(false)
    expect(expiresAt).toBeGreaterThan(Date.now())
  }, 60_000)
})
