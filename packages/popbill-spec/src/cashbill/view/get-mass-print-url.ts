import type { CashbillApiRequest, CashbillRequireRequestFields, CashbillUrlApiResponse } from '../common'

/** 현금영수증 GetMassPrintUrl 원본 계약. @see https://developers.popbill.com/api-reference/cashbill/api/view */
export type CashbillGetMassPrintUrlApiRequestPath = never
export type CashbillGetMassPrintUrlApiRequestQuery = never
export type CashbillGetMassPrintUrlApiRequestBody = string[]
export type CashbillGetMassPrintUrlApiRequest = CashbillRequireRequestFields<
  CashbillApiRequest<CashbillGetMassPrintUrlApiRequestPath, CashbillGetMassPrintUrlApiRequestQuery, CashbillGetMassPrintUrlApiRequestBody>,
  'body'
>
export type CashbillGetMassPrintUrlApiResponse = CashbillUrlApiResponse
