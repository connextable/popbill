import type { CashbillApiRequest, CashbillApiResponseBase, CashbillDateType, CashbillRequireRequestFields, CashbillSortOrder } from '../common'
import type { CashbillInfoApiModel } from '../models'

export type CashbillSearchApiRequestPath = never
export interface CashbillSearchApiRequestQuery {
  DType: CashbillDateType
  SDate: string
  EDate: string
  State?: string
  TradeType?: string
  TradeUsage?: string
  TradeOpt?: string
  TaxationType?: string
  FranchiseTaxRegID?: string
  QString?: string
  Order?: CashbillSortOrder
  Page?: number
  /** 최대 1,000건. */
  PerPage?: number
}
export type CashbillSearchApiRequestBody = never
export type CashbillSearchApiRequest = CashbillRequireRequestFields<CashbillApiRequest<never, CashbillSearchApiRequestQuery>, 'query'>
export interface CashbillSearchApiResponse extends CashbillApiResponseBase {
  pageNum?: number
  perPage?: number
  pageCount?: number
  total?: number
  list?: CashbillInfoApiModel[]
}
