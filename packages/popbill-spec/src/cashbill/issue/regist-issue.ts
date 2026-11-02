import type { CashbillApiRequest, CashbillRequireRequestFields } from '../common'
import type { CashbillApprovalApiModel, CashbillIssueResultApiModel } from '../models'

/** 현금영수증 RegistIssue 원본 계약. @see https://developers.popbill.com/api-reference/cashbill/api/issue */
export type CashbillRegistIssueApiRequestPath = never
export type CashbillRegistIssueApiRequestQuery = never
export type CashbillRegistIssueApiRequestBody = CashbillApprovalApiModel
export type CashbillRegistIssueApiRequest = CashbillRequireRequestFields<
  CashbillApiRequest<CashbillRegistIssueApiRequestPath, CashbillRegistIssueApiRequestQuery, CashbillRegistIssueApiRequestBody>,
  'body'
>
export type CashbillRegistIssueApiResponse = CashbillIssueResultApiModel
