import { stringifyWithoutEmptyValues } from '@connextable/popbill-utils'
import { createLegacyValidationError } from '@/internal/errors'
import { validateCorpNum } from '@/internal/validation'
import type { EasyFinBankRuntimeContext } from './context'

export async function request<T>(
  context: EasyFinBankRuntimeContext,
  corpNum: string,
  uri: string,
  userId?: string,
  method = 'GET',
  body?: unknown
): Promise<T> {
  const error = validateCorpNum(corpNum)
  if (error) throw error
  return context.requestClient.requestJson<T>({
    corpNum,
    uri,
    userId,
    method,
    body: body === undefined ? undefined : stringifyWithoutEmptyValues(body),
  })
}

export function requiredText(value: unknown, message: string): asserts value is string {
  if (typeof value !== 'string' || !value.trim()) throw createLegacyValidationError(message)
}

export function accountPath(bankCode: string, accountNumber: string): string {
  requiredText(bankCode, '기관코드가 입력되지 않았습니다.')
  requiredText(accountNumber, '계좌번호가 입력되지 않았습니다.')
  return `/EasyFin/Bank/BankAccount/${encodeURIComponent(bankCode)}/${encodeURIComponent(accountNumber)}`
}

export function jobPath(jobId: string): string {
  requiredText(jobId, '작업아이디가 입력되지 않았습니다.')
  if (jobId.length !== 18) throw createLegacyValidationError('작업아이디(jobID)가 올바르지 않습니다.')
  return `/EasyFin/Bank/${encodeURIComponent(jobId)}`
}

export function query(values: Record<string, unknown>): string {
  return Object.entries(values)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join('&')
}

export function filterQuery(tradeTypes?: string[], searchString?: string): string {
  return `TradeType=${encodeURIComponent(tradeTypes?.join(',') ?? '')}${searchString ? `&SearchString=${encodeURIComponent(searchString)}` : ''}`
}
