import type { CashbillApiRequest, CashbillRequireRequestFields, CashbillDocumentApiRequestPath, CashbillUrlApiResponse } from '../common'

/** 현금영수증 GetPopUpUrl 원본 계약. @see https://developers.popbill.com/api-reference/cashbill/api/view */
export type CashbillGetPopUpUrlApiRequestPath = CashbillDocumentApiRequestPath
export type CashbillGetPopUpUrlApiRequestQuery = { TG: 'POPUP' }
export type CashbillGetPopUpUrlApiRequestBody = never
export type CashbillGetPopUpUrlApiRequest = CashbillRequireRequestFields<
  CashbillApiRequest<CashbillGetPopUpUrlApiRequestPath, CashbillGetPopUpUrlApiRequestQuery, CashbillGetPopUpUrlApiRequestBody>,
  'path' | 'query'
>
export type CashbillGetPopUpUrlApiResponse = CashbillUrlApiResponse
