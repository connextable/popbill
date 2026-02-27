import type { PopbillErrorCategory } from './code-catalog'
import { PopbillErrorDomain } from './enums'
import type { PopbillApiError, PopbillKnownApiError } from './types'

export const POPBILL_ERROR_DOMAIN_BY_CATEGORY: Readonly<Record<PopbillErrorCategory, PopbillErrorDomain>> = {
  계좌조회: PopbillErrorDomain.Account,
  공통: PopbillErrorDomain.Common,
  기업정보조회: PopbillErrorDomain.CompanyInfo,
  문자: PopbillErrorDomain.Message,
  사업자등록상태조회: PopbillErrorDomain.BusinessRegistration,
  예금주조회: PopbillErrorDomain.AccountHolder,
  전자명세서: PopbillErrorDomain.Statement,
  전자세금계산서: PopbillErrorDomain.TaxInvoice,
  카카오톡: PopbillErrorDomain.Kakao,
  '카카오톡/문자': PopbillErrorDomain.Message,
  팩스: PopbillErrorDomain.Fax,
  현금영수증: PopbillErrorDomain.CashReceipt,
  홈택스수집: PopbillErrorDomain.Hometax,
} as const

export const POPBILL_ERROR_DOMAIN_LABELS: Readonly<Record<PopbillErrorDomain, string>> = {
  [PopbillErrorDomain.Common]: '공통',
  [PopbillErrorDomain.TaxInvoice]: '전자세금계산서',
  [PopbillErrorDomain.Statement]: '전자명세서',
  [PopbillErrorDomain.CashReceipt]: '현금영수증',
  [PopbillErrorDomain.Kakao]: '카카오톡',
  [PopbillErrorDomain.Message]: '메시지',
  [PopbillErrorDomain.Fax]: '팩스',
  [PopbillErrorDomain.Account]: '계좌조회',
  [PopbillErrorDomain.AccountHolder]: '예금주조회',
  [PopbillErrorDomain.BusinessRegistration]: '사업자등록상태조회',
  [PopbillErrorDomain.CompanyInfo]: '기업정보조회',
  [PopbillErrorDomain.Hometax]: '홈택스수집',
  [PopbillErrorDomain.Unknown]: '팝빌',
} as const

export type PopbillErrorDomainHandler<T> = (error: PopbillApiError) => T

export type PopbillErrorDomainHandlers<T> = Partial<Record<PopbillErrorDomain, PopbillErrorDomainHandler<T>>> & {
  default?: PopbillErrorDomainHandler<T>
}

export function getPopbillErrorDomainByCategory(category: PopbillErrorCategory): PopbillErrorDomain {
  return POPBILL_ERROR_DOMAIN_BY_CATEGORY[category]
}

export function resolvePopbillErrorDomainFromCategory(category: PopbillErrorCategory | undefined): PopbillErrorDomain {
  if (category === undefined) {
    return PopbillErrorDomain.Unknown
  }

  return getPopbillErrorDomainByCategory(category)
}

export function getPopbillErrorDomainLabel(domain: PopbillErrorDomain): string {
  return POPBILL_ERROR_DOMAIN_LABELS[domain]
}

export function isKnownPopbillApiError(error: PopbillApiError): error is PopbillKnownApiError {
  return error.knownCode
}

export function matchPopbillErrorByDomain<T>(
  error: PopbillApiError,
  handlers: PopbillErrorDomainHandlers<T>
): T | undefined {
  const domainHandler = handlers[error.domain]
  if (domainHandler) {
    return domainHandler(error)
  }

  return handlers.default?.(error)
}
