import type { CashbillApiRequest, CashbillRequireRequestFields, CashbillDocumentApiRequestPath } from '../common'
import type { CashbillIssueResultApiModel } from '../models'

/** 현금영수증 Issue 원본 계약. @see https://developers.popbill.com/api-reference/cashbill/api/issue */
export type CashbillIssueApiRequestPath = CashbillDocumentApiRequestPath
export type CashbillIssueApiRequestQuery = never
export type CashbillIssueApiRequestBody = { memo?: string }
export type CashbillIssueApiRequest = CashbillRequireRequestFields<
  CashbillApiRequest<CashbillIssueApiRequestPath, CashbillIssueApiRequestQuery, CashbillIssueApiRequestBody>,
  'path'
>
export type CashbillIssueApiResponse = CashbillIssueResultApiModel
