import type { CashbillApiRequest, CashbillRequireRequestFields, CashbillDocumentApiRequestPath } from '../common'
import type { CashbillPdfApiResponse } from '../models'

/** 현금영수증 GetPdf 원본 계약. @see https://developers.popbill.com/api-reference/cashbill/api/view */
export type CashbillGetPdfApiRequestPath = CashbillDocumentApiRequestPath
export type CashbillGetPdfApiRequestQuery = { PDF: '' }
export type CashbillGetPdfApiRequestBody = never
export type CashbillGetPdfApiRequest = CashbillRequireRequestFields<
  CashbillApiRequest<CashbillGetPdfApiRequestPath, CashbillGetPdfApiRequestQuery, CashbillGetPdfApiRequestBody>,
  'path' | 'query'
>
export type CashbillGetPdfApiResponse = CashbillPdfApiResponse
