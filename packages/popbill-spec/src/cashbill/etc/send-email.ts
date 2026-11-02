import type { CashbillApiRequest, CashbillRequireRequestFields, CashbillDocumentApiRequestPath, CashbillApiResponseBase } from '../common'

/** 현금영수증 SendEmail 원본 계약. @see https://developers.popbill.com/api-reference/cashbill/api/etc */
export type CashbillSendEmailApiRequestPath = CashbillDocumentApiRequestPath
export type CashbillSendEmailApiRequestQuery = never
export type CashbillSendEmailApiRequestBody = { receiver: string }
export type CashbillSendEmailApiRequest = CashbillRequireRequestFields<
  CashbillApiRequest<CashbillSendEmailApiRequestPath, CashbillSendEmailApiRequestQuery, CashbillSendEmailApiRequestBody>,
  'path' | 'body'
>
export type CashbillSendEmailApiResponse = CashbillApiResponseBase
