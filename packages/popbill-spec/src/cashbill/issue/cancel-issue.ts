import type { CashbillApiRequest, CashbillRequireRequestFields, CashbillDocumentApiRequestPath, CashbillApiResponseBase } from '../common'

/** 현금영수증 CancelIssue 원본 계약. @see https://developers.popbill.com/api-reference/cashbill/api/issue */
export type CashbillCancelIssueApiRequestPath = CashbillDocumentApiRequestPath
export type CashbillCancelIssueApiRequestQuery = never
export type CashbillCancelIssueApiRequestBody = { memo?: string }
export type CashbillCancelIssueApiRequest = CashbillRequireRequestFields<
  CashbillApiRequest<CashbillCancelIssueApiRequestPath, CashbillCancelIssueApiRequestQuery, CashbillCancelIssueApiRequestBody>,
  'path'
>
export type CashbillCancelIssueApiResponse = CashbillApiResponseBase
