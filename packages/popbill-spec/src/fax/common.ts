import type { PopbillApiRequestHeaders } from '../headers'
import type { PopbillApiRequest, PopbillRequireRequestFields } from '../request'

export type FaxApiRequest<TPath = never, TQuery = never, TBody = never> = PopbillApiRequest<TPath, TQuery, TBody, PopbillApiRequestHeaders>
export type FaxRequireRequestFields<T, K extends keyof T> = PopbillRequireRequestFields<T, K>
export interface FaxApiResponseBase {
  code: number
  message: string
}
export interface FaxUrlApiResponse {
  url: string
}
export interface FaxReceiptApiResponse {
  receiptNum: string
}
export type FaxReceiveNumberType = '일반' | '지능'
export type FaxSortOrder = 'A' | 'D'
export type FaxSearchState = '1' | '2' | '3' | '4' | (string & {})
export type FaxGetUrlTogo = 'BOX' | 'SENDER'
