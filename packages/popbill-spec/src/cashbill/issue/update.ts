import type { CashbillApiRequest, CashbillRequireRequestFields, CashbillDocumentApiRequestPath, CashbillApiResponseBase } from '../common'
import type { CashbillApiModel } from '../models'

/** 현금영수증 Update 원본 계약. @see https://developers.popbill.com/api-reference/cashbill/api/issue */
export type CashbillUpdateApiRequestPath = CashbillDocumentApiRequestPath
export type CashbillUpdateApiRequestQuery = never
export type CashbillUpdateApiRequestBody = CashbillApiModel
export type CashbillUpdateApiRequest = CashbillRequireRequestFields<
  CashbillApiRequest<CashbillUpdateApiRequestPath, CashbillUpdateApiRequestQuery, CashbillUpdateApiRequestBody>,
  'path' | 'body'
>
export type CashbillUpdateApiResponse = CashbillApiResponseBase
