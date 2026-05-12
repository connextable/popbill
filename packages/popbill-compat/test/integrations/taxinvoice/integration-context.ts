import * as promiseCompat from '@/promise/index'
import { TaxinvoiceBoxScopes } from '@/services/taxinvoice'

const REQUIRED_ENV_NAMES = ['POPBILL_LINK_ID', 'POPBILL_SECRET_KEY', 'POPBILL_CORP_NUM', 'POPBILL_USER_ID'] as const
const RUN_REAL_TAXINVOICE_INTEGRATION_TESTS = normalizeBooleanEnv(process.env['POPBILL_RUN_TAXINVOICE_REAL_INTEGRATION_TESTS'])

interface IntegrationEnv {
  linkId: string
  secretKey: string
  corpNum: string
  userId: string
  counterpartCorpNum: string
  receiverEmail: string
  senderPhoneNumber: string
  receiverPhoneNumber: string
  senderFaxNumber: string
  receiverFaxNumber: string
  statementItemCode: number
  statementManagementKey: string
  missingNames: string[]
}

const integrationEnv = loadIntegrationEnv()
const hasRequiredEnv = integrationEnv.missingNames.length === 0
const describeRealTaxinvoiceIntegration = RUN_REAL_TAXINVOICE_INTEGRATION_TESTS && hasRequiredEnv ? describe : describe.skip

if (RUN_REAL_TAXINVOICE_INTEGRATION_TESTS && !hasRequiredEnv) {
  throw new Error(`Missing required real taxinvoice integration env vars: ${integrationEnv.missingNames.join(', ')}`)
}

export function describeTaxinvoiceIntegration(suiteName: string, definition: () => void): void {
  describeRealTaxinvoiceIntegration(suiteName, definition)
}

export function createTaxinvoicePromiseIntegrationService() {
  promiseCompat.config({
    LinkID: integrationEnv.linkId,
    SecretKey: integrationEnv.secretKey,
    IsTest: true,
    UseLocalTimeYN: true,
    requestTimeoutMs: 30_000,
    acceptEncoding: 'gzip',
  })

  return promiseCompat.TaxinvoiceService()
}

export function getTaxinvoiceIntegrationEnv(): IntegrationEnv {
  return integrationEnv
}

export function getTaxinvoiceDefaultBoxScope(): (typeof TaxinvoiceBoxScopes)[keyof typeof TaxinvoiceBoxScopes] {
  return TaxinvoiceBoxScopes.TemporaryDocumentBox
}

export function expectTaxinvoiceApiErrorLike(error: unknown): void {
  expect(error).toMatchObject({
    code: expect.any(Number),
    message: expect.any(String),
  })
}

function loadIntegrationEnv(): IntegrationEnv {
  const statementItemCode = Number.parseInt(process.env['POPBILL_STATEMENT_ITEM_CODE']?.trim() ?? '121', 10)

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
    counterpartCorpNum: process.env['POPBILL_COUNTERPART_CORP_NUM']?.trim() || '8888888888',
    receiverEmail: process.env['POPBILL_RECEIVER_EMAIL']?.trim() || 'test@example.com',
    senderPhoneNumber: process.env['POPBILL_SENDER_PHONE']?.trim() || '07043042991',
    receiverPhoneNumber: process.env['POPBILL_RECEIVER_PHONE']?.trim() || '01043042991',
    senderFaxNumber: process.env['POPBILL_SENDER_FAX']?.trim() || '07043042991',
    receiverFaxNumber: process.env['POPBILL_RECEIVER_FAX']?.trim() || '07043042991',
    statementItemCode: Number.isInteger(statementItemCode) ? statementItemCode : 121,
    statementManagementKey: process.env['POPBILL_STATEMENT_MGT_KEY']?.trim() || 'STATEMENT-001',
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
