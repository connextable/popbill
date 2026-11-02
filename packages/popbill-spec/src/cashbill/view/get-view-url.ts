import type { CashbillApiRequest, CashbillRequireRequestFields, CashbillDocumentApiRequestPath, CashbillUrlApiResponse } from '../common'

/** 현금영수증 GetViewUrl 원본 계약. @see https://developers.popbill.com/api-reference/cashbill/api/view */
export type CashbillGetViewUrlApiRequestPath = CashbillDocumentApiRequestPath
export type CashbillGetViewUrlApiRequestQuery = { TG: 'VIEW' }
export type CashbillGetViewUrlApiRequestBody = never
export type CashbillGetViewUrlApiRequest = CashbillRequireRequestFields<
  CashbillApiRequest<CashbillGetViewUrlApiRequestPath, CashbillGetViewUrlApiRequestQuery, CashbillGetViewUrlApiRequestBody>,
  'path' | 'query'
>
export type CashbillGetViewUrlApiResponse = CashbillUrlApiResponse
