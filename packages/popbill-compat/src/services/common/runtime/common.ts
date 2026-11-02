import { stringifyWithoutEmptyValues } from '@connextable/popbill-utils'
import { createLegacyValidationError } from '@/internal/errors'
import { validateCorpNum, validateSearchDate } from '@/internal/validation'
import type { CommonRuntimeContext } from './context'

export function required(value: unknown, message: string): void {
  if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) throw createLegacyValidationError(message)
}
export function validateBusiness(corpNum: string): void {
  const error = validateCorpNum(corpNum)
  if (error) throw error
}
export async function authToken(context: CommonRuntimeContext, corpNum: string) {
  validateBusiness(corpNum)
  try {
    return await context.tokenProvider.getToken(corpNum)
  } catch (cause) {
    throw Object.assign(new Error('Popbill token issuance failed.'), { requestStage: 'issue_token', cause })
  }
}
export function query(values: Record<string, string | number | undefined>): string {
  return Object.entries(values)
    .filter(([, value]) => value !== undefined && value !== '')
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join('&')
}
export async function request<T>(
  context: CommonRuntimeContext,
  corpNum: string | undefined,
  uri: string,
  userId?: string,
  method = 'GET',
  body?: unknown
): Promise<T> {
  if (corpNum !== undefined) validateBusiness(corpNum)
  return context.requestClient.requestJson<T>({
    corpNum,
    uri,
    userId,
    method,
    body: body === undefined ? undefined : stringifyWithoutEmptyValues(body),
  })
}
export async function url(context: CommonRuntimeContext, corpNum: string, toGo: string, userId?: string): Promise<string> {
  required(toGo, '접근메뉴가 입력되지 않았습니다.')
  return (await request<{ url: string }>(context, corpNum, `/Member?TG=${encodeURIComponent(toGo)}`, userId)).url
}
export function validateDates(startDate: string, endDate: string): void {
  const startError = validateSearchDate(startDate, '조회 시작일자가 입력되지 않았습니다.', '조회 시작일자 형식이 유효하지 않습니다.')
  if (startError) throw startError
  const endError = validateSearchDate(endDate, '조회 종료일자가 입력되지 않았습니다.', '조회 종료일자 형식이 유효하지 않습니다.')
  if (endError) throw endError
}
export function parseInfoArgs<T>(userIdOrInfo: string | T | undefined, info?: T): { userId?: string; info: T } {
  return info === undefined ? { info: userIdOrInfo as T } : { userId: userIdOrInfo as string | undefined, info }
}
