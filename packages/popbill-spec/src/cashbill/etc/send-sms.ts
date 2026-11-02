import type { CashbillApiRequest, CashbillRequireRequestFields, CashbillDocumentApiRequestPath, CashbillApiResponseBase } from '../common'

/** 현금영수증 SendSms 원본 계약. @see https://developers.popbill.com/api-reference/cashbill/api/etc */
export type CashbillSendSmsApiRequestPath = CashbillDocumentApiRequestPath
export type CashbillSendSmsApiRequestQuery = never
export type CashbillSendSmsApiRequestBody = { sender: string; receiver: string; contents: string }
export type CashbillSendSmsApiRequest = CashbillRequireRequestFields<
  CashbillApiRequest<CashbillSendSmsApiRequestPath, CashbillSendSmsApiRequestQuery, CashbillSendSmsApiRequestBody>,
  'path' | 'body'
>
export type CashbillSendSmsApiResponse = CashbillApiResponseBase
