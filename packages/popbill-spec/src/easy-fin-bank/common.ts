import type { PopbillApiRequestHeaders } from '../headers'
import type { PopbillApiRequest, PopbillRequireRequestFields } from '../request'

export type EasyFinBankApiRequest<TPath = never, TQuery = never, TBody = never> = PopbillApiRequest<TPath, TQuery, TBody, PopbillApiRequestHeaders>
export type EasyFinBankRequireRequestFields<T, K extends keyof T> = PopbillRequireRequestFields<T, K>

export interface EasyFinBankApiResponseBase {
  code: number
  message: string
}
export interface EasyFinBankUrlApiResponse {
  url: string
}
export interface EasyFinBankAccountApiRequestPath {
  BankCode: string
  AccountNumber: string
}
export interface EasyFinBankJobApiRequestPath {
  jobID: string
}
export type EasyFinBankTradeType = 'I' | 'O' | (string & {})
export type EasyFinBankSortOrder = 'A' | 'D' | (string & {})
