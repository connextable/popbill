import { createPopbillClient } from '@/index'
import { TaxInvoiceStatementItemCodes, type TaxInvoiceStatementItemCode } from '@/services/tax-invoice/types'

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
  statementItemCode: TaxInvoiceStatementItemCode
  statementManagementKey: string
  missingNames: string[]
}

const integrationEnv = loadIntegrationEnv()
const hasRequiredEnv = integrationEnv.missingNames.length === 0
const describeRealTaxInvoiceIntegration = RUN_REAL_TAXINVOICE_INTEGRATION_TESTS && hasRequiredEnv ? describe : describe.skip

if (RUN_REAL_TAXINVOICE_INTEGRATION_TESTS && !hasRequiredEnv) {
  throw new Error(`Missing required real tax-invoice integration env vars: ${integrationEnv.missingNames.join(', ')}`)
}

export function describeTaxInvoiceIntegration(suiteName: string, definition: () => void): void {
  describeRealTaxInvoiceIntegration(suiteName, definition)
}

export function createTaxInvoiceIntegrationClient() {
  return createPopbillClient({
    linkId: integrationEnv.linkId,
    secretKey: integrationEnv.secretKey,
    userId: integrationEnv.userId,
    isTest: true,
    useLocalTime: true,
    requestTimeoutMs: 30_000,
    acceptEncoding: 'gzip',
  })
}

export function getTaxInvoiceIntegrationEnv(): IntegrationEnv {
  return integrationEnv
}

export function expectTaxInvoiceApiErrorLike(error: unknown): void {
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
    statementItemCode: normalizeStatementItemCode(statementItemCode),
    statementManagementKey: process.env['POPBILL_STATEMENT_MGT_KEY']?.trim() || 'STATEMENT-001',
    missingNames,
  }
}

function normalizeStatementItemCode(statementItemCode: number): TaxInvoiceStatementItemCode {
  const allowedCodes = new Set<number>(Object.values(TaxInvoiceStatementItemCodes))
  if (allowedCodes.has(statementItemCode)) {
    return statementItemCode as TaxInvoiceStatementItemCode
  }

  return TaxInvoiceStatementItemCodes.TradeStatement
}

function normalizeBooleanEnv(value: string | undefined): boolean {
  if (typeof value !== 'string') {
    return false
  }

  const normalizedValue = value.trim().toLowerCase()
  return normalizedValue === 'true' || normalizedValue === '1' || normalizedValue === 'yes'
}
