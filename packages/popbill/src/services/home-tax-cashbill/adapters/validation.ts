import { createInputValidationError, PopbillErrorStage } from '@connextable/popbill-compat/errors'
import type { HomeTaxCashbillFilterInput, RequestHomeTaxCashbillCollectionInput, SearchHomeTaxCashbillsInput } from '../types'

export function failInput(operation: string, message: string): never {
  throw createInputValidationError(message, { operation: `homeTaxCashbill.${operation}`, stage: PopbillErrorStage.ValidateInput })
}

export function validateCollectionInput(input: RequestHomeTaxCashbillCollectionInput): void {
  const fail = (message: string): never => failInput('requestCollection', message)
  if (typeof input.receiptDirection !== 'string' || input.receiptDirection.trim() === '')
    fail('receiptDirection은 비어 있지 않은 문자열이어야 합니다.')
  for (const [field, value] of [
    ['startDate', input.startDate],
    ['endDate', input.endDate],
  ] as const) {
    if (typeof value !== 'string' || !/^\d{8}$/.test(value)) fail(`${field}는 yyyyMMdd 형식이어야 합니다.`)
    const year = Number(value.slice(0, 4)),
      month = Number(value.slice(4, 6)),
      day = Number(value.slice(6, 8))
    const date = new Date(Date.UTC(year, month - 1, day))
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) fail(`${field}가 유효한 날짜가 아닙니다.`)
  }
  if (input.startDate > input.endDate) fail('startDate는 endDate 이후일 수 없습니다.')
}

export function validateFilters(input: HomeTaxCashbillFilterInput, operation: string): void {
  if (input.tradeTypes !== undefined && (!Array.isArray(input.tradeTypes) || input.tradeTypes.some((type) => typeof type !== 'string')))
    failInput(operation, 'tradeTypes는 문자열 배열이어야 합니다.')
  if (input.tradeUsages !== undefined && (!Array.isArray(input.tradeUsages) || input.tradeUsages.some((usage) => typeof usage !== 'string')))
    failInput(operation, 'tradeUsages는 문자열 배열이어야 합니다.')
}

export function normalizeSearch(input: SearchHomeTaxCashbillsInput) {
  validateFilters(input, 'searchCashbills')
  const pageNumber = input.pageNumber ?? 1
  const pageSize = input.pageSize ?? 500
  const sortOrder = input.sortOrder ?? 'D'
  if (!Number.isInteger(pageNumber) || pageNumber < 1) failInput('searchCashbills', 'pageNumber는 1 이상의 정수여야 합니다.')
  if (!Number.isInteger(pageSize) || pageSize < 1) failInput('searchCashbills', 'pageSize는 1 이상의 정수여야 합니다.')
  if (typeof sortOrder !== 'string' || sortOrder.trim() === '') failInput('searchCashbills', 'sortOrder는 비어 있지 않은 문자열이어야 합니다.')
  return { pageNumber, pageSize, sortOrder }
}
