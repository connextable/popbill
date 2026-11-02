import type { CashbillApiRequest, CashbillRequireRequestFields } from '../common'
import type { CashbillIssueResultApiModel, CashbillRevokeApiRequestBody } from '../models'

/** 현금영수증 RevokeRegistIssue 원본 계약. @see https://developers.popbill.com/api-reference/cashbill/api/issue */
export type CashbillRevokeRegistIssueApiRequestPath = never
export type CashbillRevokeRegistIssueApiRequestQuery = never
export type CashbillRevokeRegistIssueApiRequestBody = CashbillRevokeApiRequestBody
export type CashbillRevokeRegistIssueApiRequest = CashbillRequireRequestFields<
  CashbillApiRequest<CashbillRevokeRegistIssueApiRequestPath, CashbillRevokeRegistIssueApiRequestQuery, CashbillRevokeRegistIssueApiRequestBody>,
  'body'
>
export type CashbillRevokeRegistIssueApiResponse = CashbillIssueResultApiModel
