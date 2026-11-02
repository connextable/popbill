import type { CashbillApiRequest, CashbillRequireRequestFields, CashbillDocumentApiRequestPath, CashbillApiResponseBase } from '../common'

/** 현금영수증 SendFax 원본 계약. @see https://developers.popbill.com/api-reference/cashbill/api/etc */
export type CashbillSendFaxApiRequestPath = CashbillDocumentApiRequestPath
export type CashbillSendFaxApiRequestQuery = never
export type CashbillSendFaxApiRequestBody = { sender: string; receiver: string }
export type CashbillSendFaxApiRequest = CashbillRequireRequestFields<
  CashbillApiRequest<CashbillSendFaxApiRequestPath, CashbillSendFaxApiRequestQuery, CashbillSendFaxApiRequestBody>,
  'path' | 'body'
>
export type CashbillSendFaxApiResponse = CashbillApiResponseBase
