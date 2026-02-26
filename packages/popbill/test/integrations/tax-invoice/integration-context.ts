import { createPopbillClient } from '@/index'

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
const describeIntegration = RUN_INTEGRATION_TESTS && hasRequiredEnv ? describe : describe.skip

if (RUN_INTEGRATION_TESTS && !hasRequiredEnv) {
  throw new Error(`Missing required integration env vars: ${integrationEnv.missingNames.join(', ')}`)
}

export function describeTaxInvoiceIntegration(suiteName: string, definition: () => void): void {
  describeIntegration(suiteName, definition)
}

export function createTaxInvoiceIntegrationClient() {
  return createPopbillClient({
    linkId: integrationEnv.linkId,
    secretKey: integrationEnv.secretKey,
    isTest: true,
    useLocalTime: true,
    requestTimeoutMs: 30_000,
    acceptEncoding: 'gzip',
  })
}

export function getTaxInvoiceIntegrationEnv(): IntegrationEnv {
  return integrationEnv
}

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
