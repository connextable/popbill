import type { CashbillApiRequest, CashbillApiResponseBase, CashbillRequireRequestFields } from '../common'
import type { CashbillBulkIssueResultApiModel } from '../models'

export interface CashbillGetBulkResultApiRequestPath {
  SubmitID: string
}
export type CashbillGetBulkResultApiRequestQuery = never
export type CashbillGetBulkResultApiRequestBody = never
export type CashbillGetBulkResultApiRequest = CashbillRequireRequestFields<CashbillApiRequest<CashbillGetBulkResultApiRequestPath>, 'path'>
export interface CashbillGetBulkResultApiResponse extends CashbillApiResponseBase {
  submitID?: string
  receiptID?: string
  submitCount?: number
  successCount?: number
  failCount?: number
  /** 알려진 처리상태는 0, 1, 2이며 신규 서버 코드도 보존합니다. */
  txState?: number
  txResultCode?: number
  issueResult?: CashbillBulkIssueResultApiModel[]
  receiptDT?: string
  txStartDT?: string
  txEndDT?: string
}
