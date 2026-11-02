import type { PopbillApiRequestHeaders } from '../headers'
import type { PopbillApiRequest, PopbillRequireRequestFields } from '../request'

export type CashbillApiRequest<TPath = never, TQuery = never, TBody = never> = PopbillApiRequest<TPath, TQuery, TBody, PopbillApiRequestHeaders>
export type CashbillRequireRequestFields<T, K extends keyof T> = PopbillRequireRequestFields<T, K>

export interface CashbillApiResponseBase {
  code: number
  message: string
}

export interface CashbillUrlApiResponse {
  url: string
}

export interface CashbillDocumentApiRequestPath {
  MgtKey: string
}

export type CashbillTradeType = '승인거래' | '취소거래'
export type CashbillTradeUsage = '소득공제용' | '지출증빙용'
export type CashbillTradeOption = '일반' | '도서공연' | '대중교통'
export type CashbillTaxationType = '과세' | '비과세'
export type CashbillCancelType = 1 | 2 | 3
export type CashbillDateType = 'R' | 'T' | 'I'
export type CashbillSortOrder = 'A' | 'D'
export type CashbillBoxScope = 'TBOX' | 'PBOX' | 'WRITE'
export type CashbillEmailType = 'CSH_ISSUE'
