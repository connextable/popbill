import type { CashbillApiRequest, CashbillRequireRequestFields, CashbillDocumentApiRequestPath, CashbillApiResponseBase } from '../common'

/** 현금영수증 Delete 원본 계약. @see https://developers.popbill.com/api-reference/cashbill/api/issue */
export type CashbillDeleteApiRequestPath = CashbillDocumentApiRequestPath
export type CashbillDeleteApiRequestQuery = never
export type CashbillDeleteApiRequestBody = never
export type CashbillDeleteApiRequest = CashbillRequireRequestFields<
  CashbillApiRequest<CashbillDeleteApiRequestPath, CashbillDeleteApiRequestQuery, CashbillDeleteApiRequestBody>,
  'path'
>
export type CashbillDeleteApiResponse = CashbillApiResponseBase
