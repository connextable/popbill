import {
  DEFAULT_TAX_INVOICE_STATEMENT_ITEM_CODE,
  TAX_INVOICE_STATEMENT_ITEM_CODES,
  type RuntimeConfig,
  type TaxInvoiceStatementItemCode,
} from '../types.ts'
import { parseBooleanValue, parsePositiveIntegerValue, readEnvironmentString } from '../../shared/environment.ts'

const REQUIRED_ENV_NAMES = ['POPBILL_LINK_ID', 'POPBILL_SECRET_KEY', 'POPBILL_CORP_NUM', 'POPBILL_USER_ID'] as const

export function loadRuntimeConfig(): RuntimeConfig {
  const values = {
    POPBILL_LINK_ID: readEnvironmentString('POPBILL_LINK_ID', ''),
    POPBILL_SECRET_KEY: readEnvironmentString('POPBILL_SECRET_KEY', ''),
    POPBILL_CORP_NUM: readEnvironmentString('POPBILL_CORP_NUM', ''),
    POPBILL_USER_ID: readEnvironmentString('POPBILL_USER_ID', ''),
  }

  const missingNames = REQUIRED_ENV_NAMES.filter((name) => values[name].length === 0)

  return {
    linkId: values.POPBILL_LINK_ID,
    secretKey: values.POPBILL_SECRET_KEY,
    corpNum: values.POPBILL_CORP_NUM,
    userId: values.POPBILL_USER_ID,
    isTest: parseBooleanValue(readEnvironmentString('POPBILL_IS_TEST', 'true'), true),
    useLocalTime: parseBooleanValue(readEnvironmentString('POPBILL_USE_LOCAL_TIME', 'true'), true),
    requestTimeoutMs: parsePositiveIntegerValue(readEnvironmentString('POPBILL_REQUEST_TIMEOUT_MS', '30000'), 30_000),
    acceptEncoding: readEnvironmentString('POPBILL_ACCEPT_ENCODING', 'gzip') || null,
    counterpartCorpNum: readEnvironmentString('POPBILL_COUNTERPART_CORP_NUM', '8888888888'),
    receiverEmail: readEnvironmentString('POPBILL_RECEIVER_EMAIL', 'test@example.com'),
    senderPhoneNumber: readEnvironmentString('POPBILL_SENDER_PHONE', '07043042991'),
    receiverPhoneNumber: readEnvironmentString('POPBILL_RECEIVER_PHONE', '01043042991'),
    senderFaxNumber: readEnvironmentString('POPBILL_SENDER_FAX', '07043042991'),
    receiverFaxNumber: readEnvironmentString('POPBILL_RECEIVER_FAX', '07043042991'),
    statementItemCode: parseStatementItemCode(
      readEnvironmentString('POPBILL_STATEMENT_ITEM_CODE', String(DEFAULT_TAX_INVOICE_STATEMENT_ITEM_CODE)),
      DEFAULT_TAX_INVOICE_STATEMENT_ITEM_CODE
    ),
    statementManagementKey: readEnvironmentString('POPBILL_STATEMENT_MGT_KEY', ''),
    missingNames,
  }
}

function parseStatementItemCode(value: string, fallbackValue: TaxInvoiceStatementItemCode): TaxInvoiceStatementItemCode {
  const parsed = Number.parseInt(value, 10)
  for (const allowedCode of TAX_INVOICE_STATEMENT_ITEM_CODES) {
    if (parsed === allowedCode) {
      return allowedCode
    }
  }

  return fallbackValue
}
