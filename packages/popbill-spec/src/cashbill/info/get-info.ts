import type { CashbillApiRequest, CashbillRequireRequestFields, CashbillDocumentApiRequestPath } from '../common'
import type { CashbillInfoApiModel } from '../models'

/** 현금영수증 GetInfo 원본 계약. @see https://developers.popbill.com/api-reference/cashbill/api/info */
export type CashbillGetInfoApiRequestPath = CashbillDocumentApiRequestPath
export type CashbillGetInfoApiRequestQuery = never
export type CashbillGetInfoApiRequestBody = never
export type CashbillGetInfoApiRequest = CashbillRequireRequestFields<
  CashbillApiRequest<CashbillGetInfoApiRequestPath, CashbillGetInfoApiRequestQuery, CashbillGetInfoApiRequestBody>,
  'path'
>
export type CashbillGetInfoApiResponse = CashbillInfoApiModel
