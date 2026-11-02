import type { PopbillApiRequest } from '../../request'
import type { PopbillBulkIssueRequestHeaders } from '../../headers'
import type { CashbillApiResponseBase } from '../common'
import type { CashbillApprovalApiModel } from '../models'

export type CashbillBulkSubmitApiRequestPath = never
export type CashbillBulkSubmitApiRequestQuery = never
export interface CashbillBulkSubmitApiRequestBody {
  /** 최대 100건. */
  cashbills: CashbillApprovalApiModel[]
}
export type CashbillBulkSubmitApiRequest = PopbillApiRequest<never, never, CashbillBulkSubmitApiRequestBody, PopbillBulkIssueRequestHeaders> & {
  headers: PopbillBulkIssueRequestHeaders
  body: CashbillBulkSubmitApiRequestBody
}
export interface CashbillBulkSubmitApiResponse extends CashbillApiResponseBase {
  receiptID?: string
}
