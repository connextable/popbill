import type { CashbillApiRequest } from '../common'
import type { CashbillEmailConfigApiModel } from '../models'

/** 현금영수증 ListEmailConfig 원본 계약. @see https://developers.popbill.com/api-reference/cashbill/api/etc */
export type CashbillListEmailConfigApiRequestPath = never
export type CashbillListEmailConfigApiRequestQuery = never
export type CashbillListEmailConfigApiRequestBody = never
export type CashbillListEmailConfigApiRequest = CashbillApiRequest<
  CashbillListEmailConfigApiRequestPath,
  CashbillListEmailConfigApiRequestQuery,
  CashbillListEmailConfigApiRequestBody
>
export type CashbillListEmailConfigApiResponse = CashbillEmailConfigApiModel[]
