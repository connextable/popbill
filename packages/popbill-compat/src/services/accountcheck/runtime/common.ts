import { createLegacyValidationError } from '@/internal/errors'
import { requireLookupText } from '@/internal/lookup-runtime'

export function accountQuery(bankCode: string, accountNumber: string): string {
  requireLookupText(bankCode, '기관코드가 입력되지 않았습니다.')
  if (bankCode.length !== 4) throw createLegacyValidationError('기관코드가 올바르지 않습니다.')
  requireLookupText(accountNumber, '계좌번호가 입력되지 않았습니다.')
  return `c=${encodeURIComponent(bankCode)}&n=${encodeURIComponent(accountNumber)}`
}

export function costQuery(serviceType?: string): string {
  return serviceType === undefined || serviceType === '' ? '' : `?serviceType=${encodeURIComponent(serviceType)}`
}
