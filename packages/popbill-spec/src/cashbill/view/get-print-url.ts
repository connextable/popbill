import type { CashbillApiRequest, CashbillRequireRequestFields, CashbillDocumentApiRequestPath, CashbillUrlApiResponse } from '../common'

/** 현금영수증 GetPrintUrl 원본 계약. @see https://developers.popbill.com/api-reference/cashbill/api/view */
export type CashbillGetPrintUrlApiRequestPath = CashbillDocumentApiRequestPath
export type CashbillGetPrintUrlApiRequestQuery = { TG: 'PRINT' }
export type CashbillGetPrintUrlApiRequestBody = never
export type CashbillGetPrintUrlApiRequest = CashbillRequireRequestFields<
  CashbillApiRequest<CashbillGetPrintUrlApiRequestPath, CashbillGetPrintUrlApiRequestQuery, CashbillGetPrintUrlApiRequestBody>,
  'path' | 'query'
>
export type CashbillGetPrintUrlApiResponse = CashbillUrlApiResponse
