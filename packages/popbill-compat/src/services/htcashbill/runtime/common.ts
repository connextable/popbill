import { stringifyWithoutEmptyValues } from '@connextable/popbill-utils'
import { createLegacyValidationError } from '@/internal/errors'
import { validateCorpNum } from '@/internal/validation'
import type { HTCashbillRuntimeContext } from './context'

export async function request<T>(
  context: HTCashbillRuntimeContext,
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
  if (typeof value !== 'string' || value.trim() === '') throw createLegacyValidationError(message)
}

export function jobPath(jobId: string): string {
  requiredText(jobId, '작업아이디(jobID)가 입력되지 않았습니다.')
  if (jobId.length !== 18) throw createLegacyValidationError('작업아이디(jobID)가 올바르지 않습니다.')
  return `/HomeTax/Cashbill/${encodeURIComponent(jobId)}`
}

export function filterQuery(tradeType?: string[], tradeUsage?: string[]): URLSearchParams {
  const query = new URLSearchParams({ TradeType: tradeType?.join(',') ?? '' })
  if (tradeUsage?.length) query.set('TradeUsage', tradeUsage.join(','))
  return query
}
