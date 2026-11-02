import type { CashbillApiRequest, CashbillRequireRequestFields, CashbillApiResponseBase } from '../common'
import type { CashbillRevokeApiRequestBody } from '../models'

/** 현금영수증 RevokeRegister 원본 계약. @see https://developers.popbill.com/api-reference/cashbill/api/issue */
export type CashbillRevokeRegisterApiRequestPath = never
export type CashbillRevokeRegisterApiRequestQuery = never
export type CashbillRevokeRegisterApiRequestBody = CashbillRevokeApiRequestBody
export type CashbillRevokeRegisterApiRequest = CashbillRequireRequestFields<
  CashbillApiRequest<CashbillRevokeRegisterApiRequestPath, CashbillRevokeRegisterApiRequestQuery, CashbillRevokeRegisterApiRequestBody>,
  'body'
>
export type CashbillRevokeRegisterApiResponse = CashbillApiResponseBase
