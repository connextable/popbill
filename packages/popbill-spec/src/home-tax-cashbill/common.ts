import type { PopbillApiRequest } from '../request'

/** 홈택스 현금영수증 수집 요청(raw). */
export type HomeTaxCashbillApiRequest<TPath = never, TQuery = never, TBody = never> = PopbillApiRequest<TPath, TQuery, TBody>
export type HomeTaxCashbillType = 'SELL' | 'BUY' | (string & {})
export type HomeTaxCashbillTradeType = 'N' | 'C' | (string & {})
export type HomeTaxCashbillTradeUsage = 'P' | 'C' | (string & {})
export type HomeTaxCashbillSortOrder = 'D' | 'A' | (string & {})

export interface HomeTaxCashbillApiResponseBase {
  code: number
  message: string
}

export interface HomeTaxCashbillJobApiRequestPath {
  jobID: string
}

export interface HomeTaxCashbillFilterApiRequestQuery {
  /** 쉼표로 구분한 N(승인), C(취소). */
  TradeType?: string
  /** 쉼표로 구분한 P(소득공제), C(지출증빙). */
  TradeUsage?: string
}

export interface HomeTaxCashbillUrlApiResponse {
  /** 발급 후 30초 동안 유효합니다. */
  url: string
}
