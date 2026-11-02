import type { CashbillApiRequest } from '../common'
import type { CashbillChargeInfoApiResponse } from '../models'

/** 현금영수증 GetChargeInfo 원본 계약. @see https://developers.popbill.com/api-reference/cashbill/api/../common-api/point */
export type CashbillGetChargeInfoApiRequestPath = never
export type CashbillGetChargeInfoApiRequestQuery = never
export type CashbillGetChargeInfoApiRequestBody = never
export type CashbillGetChargeInfoApiRequest = CashbillApiRequest<
  CashbillGetChargeInfoApiRequestPath,
  CashbillGetChargeInfoApiRequestQuery,
  CashbillGetChargeInfoApiRequestBody
>
export type CashbillGetChargeInfoApiResponse = CashbillChargeInfoApiResponse
