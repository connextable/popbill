import type { CashbillApiRequest, CashbillRequireRequestFields } from '../common'
import type { CashbillInfoApiModel } from '../models'

/** 현금영수증 GetInfos 원본 계약. @see https://developers.popbill.com/api-reference/cashbill/api/info */
export type CashbillGetInfosApiRequestPath = never
export type CashbillGetInfosApiRequestQuery = never
export type CashbillGetInfosApiRequestBody = string[]
export type CashbillGetInfosApiRequest = CashbillRequireRequestFields<
  CashbillApiRequest<CashbillGetInfosApiRequestPath, CashbillGetInfosApiRequestQuery, CashbillGetInfosApiRequestBody>,
  'body'
>
export type CashbillGetInfosApiResponse = CashbillInfoApiModel[]
