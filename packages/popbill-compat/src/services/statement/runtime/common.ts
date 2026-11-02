import { stringifyWithoutEmptyValues } from '@connextable/popbill-utils'
import { createLegacyValidationError } from '@/internal/errors'
import { validateCorpNum, validateMgtKey } from '@/internal/validation'
import { buildSingleFileMultipartPayload } from '@/services/taxinvoice/runtime/methods/multipart'
import type { StatementItemCode } from '@/services/statement/types'
import type { StatementRuntimeContext } from './context'
import type * as Spec from '@connextable/popbill-spec'

const ITEM_CODES = new Set(['121', '122', '123', '124', '125', '126'])

export async function request<T>(
  context: StatementRuntimeContext,
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
    body: serializeRequestBody(body),
  })
}

export async function url(
  context: StatementRuntimeContext,
  corpNum: string,
  uri: string,
  userId?: string,
  method = 'GET',
  body?: unknown
): Promise<string> {
  const response = await request<{ url: string }>(context, corpNum, uri, userId, method, body)
  return response.url
}

export async function upload(
  context: StatementRuntimeContext,
  corpNum: string,
  itemCode: StatementItemCode,
  mgtKey: string,
  fileName: string,
  fileData: Buffer,
  userId?: string,
  displayName?: string
): Promise<Spec.StatementApiResponseBase> {
  const uri = `${documentPath(itemCode, mgtKey)}/Files`
  const error = validateCorpNum(corpNum)
  if (error) throw error
  requiredText(fileName, '첨부파일명이 입력되지 않았습니다.')
  if (!Buffer.isBuffer(fileData)) throw createLegacyValidationError('첨부파일 바이너리가 입력되지 않았습니다.')
  const payload = buildSingleFileMultipartPayload({
    filePathOrName: fileName,
    fileData,
    displayName,
    formData: displayName === undefined ? '' : stringifyWithoutEmptyValues({ DisplayName: displayName }),
  })
  return context.requestClient.requestJson<Spec.StatementApiResponseBase>({
    uri,
    corpNum,
    userId,
    method: 'POST',
    body: new Uint8Array(payload.body),
    contentType: payload.contentType,
  })
}

export function requiredText(value: unknown, message: string): asserts value is string {
  if (typeof value !== 'string' || value.trim().length === 0) throw createLegacyValidationError(message)
}

function serializeRequestBody(body: unknown): string | undefined {
  const propertyBag = body && typeof body === 'object' && 'propertyBag' in body ? body.propertyBag : undefined
  return JSON.stringify(body, function (this: unknown, _key, value: unknown) {
    // Custom form properties use empty strings to clear existing values.
    if (propertyBag !== undefined && this === propertyBag) return value
    return value === null || value === undefined || value === '' ? undefined : value
  })
}

export function validateItemCode(value: unknown): void {
  if (value === undefined || value === null || value === '') throw createLegacyValidationError('전자명세서 문서유형이 입력되지 않았습니다.')
  if ((typeof value !== 'string' && typeof value !== 'number') || !ITEM_CODES.has(String(value))) {
    throw createLegacyValidationError('전자명세서 문서유형이 올바르지 않습니다.')
  }
}

export function documentPath(itemCode: StatementItemCode, mgtKey: string): string {
  validateItemCode(itemCode)
  const error = validateMgtKey(mgtKey)
  if (error) throw error
  return `/Statement/${itemCode}/${encodeURIComponent(mgtKey)}`
}

export function validateStatement(statement: unknown): void {
  if (!statement || typeof statement !== 'object' || Array.isArray(statement)) throw createLegacyValidationError('명세서정보가 입력되지 않았습니다.')
}

export function validateKeys(keys: string[]): void {
  if (!Array.isArray(keys) || keys.length === 0) throw createLegacyValidationError('문서번호배열이 입력되지 않았습니다.')
  for (const key of keys) {
    const error = validateMgtKey(key)
    if (error) throw error
  }
}
