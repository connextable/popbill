import { createLinkhubAuthClient, createTokenProvider, LinkhubAuthScope } from '@/internal/linkhub'
import { createPopbillRequestClient } from '@/internal/popbill'

const REQUIRED_ENV_NAMES = ['POPBILL_LINK_ID', 'POPBILL_SECRET_KEY', 'POPBILL_CORP_NUM', 'POPBILL_USER_ID'] as const
const RUN_INTEGRATION_TESTS = normalizeBooleanEnv(process.env['POPBILL_RUN_INTEGRATION_TESTS'])
const INTEGRATION_SERVICE_ID = 'POPBILL_TEST'
const INTEGRATION_TIMEOUT_MILLISECONDS = 30_000

interface IntegrationEnv {
  linkId: string
  secretKey: string
  corpNum: string
  userId: string
  missingNames: string[]
}

const integrationEnv = loadIntegrationEnv()
const hasRequiredEnv = integrationEnv.missingNames.length === 0
const describeIntegration = RUN_INTEGRATION_TESTS && hasRequiredEnv ? describe : describe.skip

if (RUN_INTEGRATION_TESTS && !hasRequiredEnv) {
  throw new Error(`Missing required integration env vars: ${integrationEnv.missingNames.join(', ')}`)
}

export function describeCoreIntegration(suiteName: string, definition: () => void): void {
  describeIntegration(suiteName, definition)
}

export function getCoreIntegrationEnv(): IntegrationEnv {
  return integrationEnv
}

export function createCoreAuthClient() {
  return createLinkhubAuthClient({
    linkId: integrationEnv.linkId,
    secretKey: integrationEnv.secretKey,
    useLocalTime: true,
    timeoutMs: INTEGRATION_TIMEOUT_MILLISECONDS,
  })
}

export function createCoreRequestClient() {
  const authClient = createCoreAuthClient()
  const tokenProvider = createTokenProvider({
    authClient,
    serviceId: INTEGRATION_SERVICE_ID,
    scopes: [LinkhubAuthScope.Member, LinkhubAuthScope.TaxInvoice],
  })

  return createPopbillRequestClient({
    apiBaseUrl: 'https://popbill-test.linkhub.co.kr',
    timeoutMs: INTEGRATION_TIMEOUT_MILLISECONDS,
    tokenProvider,
    acceptEncoding: 'gzip',
  })
}

export const coreIntegrationScopes = [LinkhubAuthScope.Member, LinkhubAuthScope.TaxInvoice] as const
export const coreIntegrationServiceId = INTEGRATION_SERVICE_ID

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
