import type { CashbillApiRequest, CashbillRequireRequestFields, CashbillDocumentApiRequestPath, CashbillUrlApiResponse } from '../common'

/** 현금영수증 GetPdfUrl 원본 계약. @see https://developers.popbill.com/api-reference/cashbill/api/view */
export type CashbillGetPdfUrlApiRequestPath = CashbillDocumentApiRequestPath
export type CashbillGetPdfUrlApiRequestQuery = { TG: 'PDF' }
export type CashbillGetPdfUrlApiRequestBody = never
export type CashbillGetPdfUrlApiRequest = CashbillRequireRequestFields<
  CashbillApiRequest<CashbillGetPdfUrlApiRequestPath, CashbillGetPdfUrlApiRequestQuery, CashbillGetPdfUrlApiRequestBody>,
  'path' | 'query'
>
export type CashbillGetPdfUrlApiResponse = CashbillUrlApiResponse
