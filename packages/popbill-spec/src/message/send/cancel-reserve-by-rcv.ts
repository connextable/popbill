import type { MessageApiRequest, MessageRequireRequestFields, MessageApiResponseBase } from '../common'

/** @see https://developers.popbill.com/api-reference/sms/api/send */
export type MessageCancelReservebyRCVApiRequestPath = { receiptNum: string }
export type MessageCancelReservebyRCVApiRequestQuery = never
export type MessageCancelReservebyRCVApiRequestBody = { receiveNum: string }
export type MessageCancelReservebyRCVApiRequest = MessageRequireRequestFields<
  MessageApiRequest<MessageCancelReservebyRCVApiRequestPath, MessageCancelReservebyRCVApiRequestQuery, MessageCancelReservebyRCVApiRequestBody>,
  'path' | 'body'
>
export type MessageCancelReservebyRCVApiResponse = MessageApiResponseBase
