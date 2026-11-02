import type { CashbillApiRequest, CashbillRequireRequestFields, CashbillDocumentApiRequestPath, CashbillUrlApiResponse } from '../common'

/** 현금영수증 GetEPrintUrl 원본 계약. @see https://developers.popbill.com/api-reference/cashbill/api/view */
export type CashbillGetEPrintUrlApiRequestPath = CashbillDocumentApiRequestPath
export type CashbillGetEPrintUrlApiRequestQuery = { TG: 'EPRINT' }
export type CashbillGetEPrintUrlApiRequestBody = never
export type CashbillGetEPrintUrlApiRequest = CashbillRequireRequestFields<
  CashbillApiRequest<CashbillGetEPrintUrlApiRequestPath, CashbillGetEPrintUrlApiRequestQuery, CashbillGetEPrintUrlApiRequestBody>,
  'path' | 'query'
>
export type CashbillGetEPrintUrlApiResponse = CashbillUrlApiResponse
