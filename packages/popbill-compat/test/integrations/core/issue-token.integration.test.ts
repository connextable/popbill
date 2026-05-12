import * as integrationContext from './integration-context'

const integrationEnv = integrationContext.getCoreIntegrationEnv()

integrationContext.describeCoreIntegration('popbill-compat integration: issueToken', () => {
  test('issues a real test token from Linkhub', async () => {
    const authClient = integrationContext.createCoreAuthClient()

    const issuedToken = await authClient.issueToken({
      serviceId: integrationContext.coreIntegrationServiceId,
      accessId: integrationEnv.corpNum,
      scopes: [...integrationContext.coreIntegrationScopes],
    })

    const expiresAt = Date.parse(issuedToken.expiredAt)

    expect(issuedToken.serviceId).toBe(integrationContext.coreIntegrationServiceId)
    expect(issuedToken.sessionToken.length).toBeGreaterThan(0)
    expect(Number.isNaN(expiresAt)).toBe(false)
    expect(expiresAt).toBeGreaterThan(Date.now())
  }, 60_000)
})
