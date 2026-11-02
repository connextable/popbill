import type { PopbillApiRequestHeaders } from '../headers'
import type { PopbillApiRequest, PopbillRequireRequestFields } from '../request'

/** 전자명세서 공통 요청(raw). */
export type StatementApiRequest<TPath = never, TQuery = never, TBody = never> = PopbillApiRequest<TPath, TQuery, TBody, PopbillApiRequestHeaders>

export type StatementRequireRequestFields<T, K extends keyof T> = PopbillRequireRequestFields<T, K>

/** 전자명세서 공통 처리 결과(raw). */
export interface StatementApiResponseBase {
  code: number
  message: string
}

/** 전자명세서 보기·인쇄 URL 응답(raw). */
export interface StatementUrlApiResponse {
  url: string
}

/**
 * 전자명세서 문서 종류.
 * @see https://developers.popbill.com/api-reference/statement/api/issue
 */
export const StatementItemCodes = {
  TradeStatement: 121,
  Invoice: 122,
  Estimate: 123,
  PurchaseOrder: 124,
  Deposit: 125,
  Receipt: 126,
} as const

export type StatementItemCode = (typeof StatementItemCodes)[keyof typeof StatementItemCodes]

/** 날짜(yyyyMMdd). */
export type StatementDateString = string

/** 일시(yyyyMMddHHmmss). */
export type StatementDateTimeString = string

export type StatementTaxType = '과세' | '영세' | '면세'
export type StatementPurposeType = '영수' | '청구' | '없음'
export type StatementDateType = 'R' | 'W' | 'I'
export type StatementSortOrder = 'D' | 'A'

/** Search 상태 필터. 뒤 두 자리에 와일드카드를 사용할 수 있다. */
export type StatementSearchStateCode = string

/** 전자명세서 문서함 화면. */
export type StatementGetUrlTogo = 'TBOX' | 'SWBOX'

/** 문서 종류와 파트너가 부여한 문서번호로 식별한다. */
export interface StatementDocumentApiRequestPath {
  ItemCode: StatementItemCode
  MgtKey: string
}

/** 전자명세서 발행 안내메일 종류. */
export type StatementEmailType = 'SMT_ISSUE' | 'SMT_ACCEPT' | 'SMT_DENY' | 'SMT_CANCEL' | 'SMT_CANCEL_ISSUE'
