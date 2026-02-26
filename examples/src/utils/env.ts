import type { RuntimeConfig } from '../types.ts'

const REQUIRED_ENV_NAMES = ['POPBILL_LINK_ID', 'POPBILL_SECRET_KEY', 'POPBILL_CORP_NUM', 'POPBILL_USER_ID'] as const

export function loadRuntimeConfig(): RuntimeConfig {
  const values = {
    POPBILL_LINK_ID: readEnv('POPBILL_LINK_ID', ''),
    POPBILL_SECRET_KEY: readEnv('POPBILL_SECRET_KEY', ''),
    POPBILL_CORP_NUM: readEnv('POPBILL_CORP_NUM', ''),
    POPBILL_USER_ID: readEnv('POPBILL_USER_ID', ''),
  }

  const missingNames = REQUIRED_ENV_NAMES.filter((name) => values[name].length === 0)

  return {
    linkId: values.POPBILL_LINK_ID,
    secretKey: values.POPBILL_SECRET_KEY,
    corpNum: values.POPBILL_CORP_NUM,
    userId: values.POPBILL_USER_ID,
    isTest: parseBoolean(readEnv('POPBILL_IS_TEST', 'true'), true),
    useLocalTime: parseBoolean(readEnv('POPBILL_USE_LOCAL_TIME', 'true'), true),
    requestTimeoutMs: parsePositiveInteger(readEnv('POPBILL_REQUEST_TIMEOUT_MS', '30000'), 30_000),
    acceptEncoding: readEnv('POPBILL_ACCEPT_ENCODING', 'gzip') || null,
    counterpartCorpNum: readEnv('POPBILL_COUNTERPART_CORP_NUM', '8888888888'),
    receiverEmail: readEnv('POPBILL_RECEIVER_EMAIL', 'test@example.com'),
    senderPhoneNumber: readEnv('POPBILL_SENDER_PHONE', '07043042991'),
    receiverPhoneNumber: readEnv('POPBILL_RECEIVER_PHONE', '01043042991'),
    senderFaxNumber: readEnv('POPBILL_SENDER_FAX', '07043042991'),
    receiverFaxNumber: readEnv('POPBILL_RECEIVER_FAX', '07043042991'),
    statementItemCode: parsePositiveInteger(readEnv('POPBILL_STATEMENT_ITEM_CODE', '121'), 121),
    statementManagementKey: readEnv('POPBILL_STATEMENT_MGT_KEY', ''),
    missingNames,
  }
}

function readEnv(name: string, fallbackValue: string): string {
  const value = process.env[name]
  if (typeof value !== 'string') {
    return fallbackValue
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : fallbackValue
}

function parseBoolean(value: string, fallbackValue: boolean): boolean {
  const normalized = value.trim().toLowerCase()

  if (['1', 'true', 'yes', 'y', 'on'].includes(normalized)) {
    return true
  }
  if (['0', 'false', 'no', 'n', 'off'].includes(normalized)) {
    return false
  }

  return fallbackValue
}

function parsePositiveInteger(value: string, fallbackValue: number): number {
  const parsed = Number.parseInt(value, 10)
  if (Number.isInteger(parsed) && parsed > 0) {
    return parsed
  }
  return fallbackValue
}
