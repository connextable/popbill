import type { CashbillApiRequest, CashbillRequireRequestFields, CashbillDocumentApiRequestPath, CashbillUrlApiResponse } from '../common'

/** 현금영수증 GetMailUrl 원본 계약. @see https://developers.popbill.com/api-reference/cashbill/api/view */
export type CashbillGetMailUrlApiRequestPath = CashbillDocumentApiRequestPath
export type CashbillGetMailUrlApiRequestQuery = { TG: 'MAIL' }
export type CashbillGetMailUrlApiRequestBody = never
export type CashbillGetMailUrlApiRequest = CashbillRequireRequestFields<
  CashbillApiRequest<CashbillGetMailUrlApiRequestPath, CashbillGetMailUrlApiRequestQuery, CashbillGetMailUrlApiRequestBody>,
  'path' | 'query'
>
export type CashbillGetMailUrlApiResponse = CashbillUrlApiResponse
