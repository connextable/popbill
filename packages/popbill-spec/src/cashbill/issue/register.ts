import type { CashbillApiRequest, CashbillRequireRequestFields, CashbillApiResponseBase } from '../common'
import type { CashbillApiModel } from '../models'

/** 현금영수증 Register 원본 계약. @see https://developers.popbill.com/api-reference/cashbill/api/issue */
export type CashbillRegisterApiRequestPath = never
export type CashbillRegisterApiRequestQuery = never
export type CashbillRegisterApiRequestBody = CashbillApiModel
export type CashbillRegisterApiRequest = CashbillRequireRequestFields<
  CashbillApiRequest<CashbillRegisterApiRequestPath, CashbillRegisterApiRequestQuery, CashbillRegisterApiRequestBody>,
  'body'
>
export type CashbillRegisterApiResponse = CashbillApiResponseBase
