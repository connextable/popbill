import { LinkhubAuthScope, createLinkhubAuthClient, createPopbillRequestClient, createTokenProvider } from '@/index'

const REQUIRED_ENV_NAMES = ['POPBILL_LINK_ID', 'POPBILL_SECRET_KEY', 'POPBILL_CORP_NUM', 'POPBILL_USER_ID'] as const
const RUN_INTEGRATION_TESTS = normalizeBooleanEnv(process.env['POPBILL_RUN_INTEGRATION_TESTS'])

interface IntegrationEnv {
  linkId: string
  secretKey: string
  corpNum: string
  userId: string
  missingNames: string[]
}

const integrationEnv = loadIntegrationEnv()
const hasRequiredEnv = integrationEnv.missingNames.length === 0
const describeLiveIntegration = RUN_INTEGRATION_TESTS && hasRequiredEnv ? describe : describe.skip

if (RUN_INTEGRATION_TESTS && !hasRequiredEnv) {
  throw new Error(`Missing required integration env vars: ${integrationEnv.missingNames.join(', ')}`)
}

describeLiveIntegration('popbill-core live integration', () => {
  test('issues a real test token from Linkhub', async () => {
    const authClient = createLinkhubAuthClient({
      linkId: integrationEnv.linkId,
      secretKey: integrationEnv.secretKey,
      useLocalTime: true,
      timeoutMs: 30_000,
    })

    const issuedToken = await authClient.issueToken({
      serviceId: 'POPBILL_TEST',
      accessId: integrationEnv.corpNum,
      scopes: [LinkhubAuthScope.Member, LinkhubAuthScope.TaxInvoice],
    })

    const expiresAt = Date.parse(issuedToken.expiredAt)

    expect(issuedToken.serviceId).toBe('POPBILL_TEST')
    expect(issuedToken.sessionToken.length).toBeGreaterThan(0)
    expect(Number.isNaN(expiresAt)).toBe(false)
    expect(expiresAt).toBeGreaterThan(Date.now())
  }, 60_000)

  test('calls real test Taxinvoice API with issued token', async ({ annotate }) => {
    const authClient = createLinkhubAuthClient({
      linkId: integrationEnv.linkId,
      secretKey: integrationEnv.secretKey,
      useLocalTime: true,
      timeoutMs: 30_000,
    })

    const tokenProvider = createTokenProvider({
      authClient,
      serviceId: 'POPBILL_TEST',
      scopes: [LinkhubAuthScope.Member, LinkhubAuthScope.TaxInvoice],
    })

    const requestClient = createPopbillRequestClient({
      apiBaseUrl: 'https://popbill-test.linkhub.co.kr',
      timeoutMs: 30_000,
      tokenProvider,
      acceptEncoding: 'gzip',
    })

    const response = await requestClient.requestJson<{ url: string }>({
      uri: '/Taxinvoice?TG=TBOX',
      method: 'GET',
      corpNum: integrationEnv.corpNum,
      userId: integrationEnv.userId,
    })

    void annotate(`Received response: ${JSON.stringify(response)}`, 'log')

    expect(typeof response.url).toBe('string')
    expect(response.url.startsWith('http')).toBe(true)
  }, 60_000)
})

function loadIntegrationEnv(): IntegrationEnv {
  const envValues = {
    POPBILL_LINK_ID: process.env['POPBILL_LINK_ID']?.trim() ?? '',
    POPBILL_SECRET_KEY: process.env['POPBILL_SECRET_KEY']?.trim() ?? '',
    POPBILL_CORP_NUM: process.env['POPBILL_CORP_NUM']?.trim() ?? '',
    POPBILL_USER_ID: process.env['POPBILL_USER_ID']?.trim() ?? '',
  }

  const missingNames = REQUIRED_ENV_NAMES.filter((name) => envValues[name].length === 0)

  return {
    linkId: envValues.POPBILL_LINK_ID,
    secretKey: envValues.POPBILL_SECRET_KEY,
    corpNum: envValues.POPBILL_CORP_NUM,
    userId: envValues.POPBILL_USER_ID,
    missingNames,
  }
}

function normalizeBooleanEnv(value: string | undefined): boolean {
  if (typeof value !== 'string') {
    return false
  }

  const normalizedValue = value.trim().toLowerCase()
  return normalizedValue === 'true' || normalizedValue === '1' || normalizedValue === 'yes'
}
