import { stringifyWithoutEmptyValues } from '@connextable/popbill-utils'
import { createLegacyValidationError } from '@/internal/errors'
import { validateCorpNum } from '@/internal/validation'
import type { HTTaxinvoiceRuntimeContext } from './context'

export const BASE_PATH = '/HomeTax/Taxinvoice'
export async function request<T>(
  context: HTTaxinvoiceRuntimeContext,
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
export async function url(context: HTTaxinvoiceRuntimeContext, corpNum: string, uri: string, userId?: string): Promise<string> {
  return (await request<{ url: string }>(context, corpNum, uri, userId)).url
}
export function required(value: unknown, message: string): asserts value is string {
  if (typeof value !== 'string' || value.trim() === '') throw createLegacyValidationError(message)
}
export function jobPath(jobId: string): string {
  required(jobId, '작업아이디(jobID)가 입력되지 않았습니다.')
  if (jobId.length !== 18) throw createLegacyValidationError('작업아이디(jobID)가 올바르지 않습니다.')
  return `${BASE_PATH}/${encodeURIComponent(jobId)}`
}
export function documentPath(confirmationNumber: string): string {
  required(confirmationNumber, '국세청승인번호(NTSConfirmNum)가 입력되지 않았습니다.')
  if (confirmationNumber.length !== 24) throw createLegacyValidationError('국세청승인번호(NTSConfirmNum)가 올바르지 않습니다.')
  return `${BASE_PATH}/${encodeURIComponent(confirmationNumber)}`
}
export function filterQuery(
  type?: string[],
  taxType?: string[],
  purposeType?: string[],
  taxRegIdType?: string,
  taxRegIdYn?: string,
  taxRegId?: string,
  searchString?: string
): string {
  const query = ['Type=' + (type?.map((value) => encodeURIComponent(value)).join(',') ?? '')]
  const filters = {
    TaxType: taxType?.toString(),
    PurposeType: purposeType?.toString(),
    TaxRegIDType: taxRegIdType,
    TaxRegID: taxRegId,
    TaxRegIDYN: taxRegIdYn,
    SearchString: searchString,
  }
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== '') query.push(`${key}=${encodeURIComponent(value)}`)
  }
  return query.join('&')
}
