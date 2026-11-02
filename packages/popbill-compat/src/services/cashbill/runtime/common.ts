import { stringifyWithoutEmptyValues } from '@connextable/popbill-utils'
import { createLegacyValidationError } from '@/internal/errors'
import { validateCorpNum, validateMgtKey } from '@/internal/validation'
import type { CashbillRuntimeContext } from './context'

export async function request<T>(
  context: CashbillRuntimeContext,
  corpNum: string,
  uri: string,
  userId?: string,
  method = 'GET',
  body?: unknown,
  submitId?: string
): Promise<T> {
  const error = validateCorpNum(corpNum)
  if (error) throw error
  return context.requestClient.requestJson<T>({
    corpNum,
    uri,
    userId,
    method,
    body: body === undefined ? undefined : stringifyWithoutEmptyValues(body),
    submitId,
  })
}

export async function url(
  context: CashbillRuntimeContext,
  corpNum: string,
  uri: string,
  userId?: string,
  method = 'GET',
  body?: unknown
): Promise<string> {
  const result = await request<{ url: string }>(context, corpNum, uri, userId, method, body)
  return result.url
}

export function documentPath(mgtKey: string): string {
  const error = validateMgtKey(mgtKey)
  if (error) throw error
  return `/Cashbill/${encodeURIComponent(mgtKey)}`
}

export function requiredText(value: unknown, message: string): asserts value is string {
  if (typeof value !== 'string' || value.trim().length === 0) throw createLegacyValidationError(message)
}

export function validateDocument(value: unknown): void {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw createLegacyValidationError('현금영수증 정보가 입력되지 않았습니다.')
}

export function validateKeys(keys: string[]): void {
  if (!Array.isArray(keys) || keys.length === 0) throw createLegacyValidationError('문서번호배열이 입력되지 않았습니다.')
  for (const key of keys) documentPath(key)
}
