import type { MessageApiRequest, MessageRequireRequestFields, MessageApiResponseBase } from '../common'

/** @see https://developers.popbill.com/api-reference/sms/api/send */
export type MessageCancelReserveApiRequestPath = { receiptNum: string }
export type MessageCancelReserveApiRequestQuery = never
export type MessageCancelReserveApiRequestBody = never
export type MessageCancelReserveApiRequest = MessageRequireRequestFields<
  MessageApiRequest<MessageCancelReserveApiRequestPath, MessageCancelReserveApiRequestQuery, MessageCancelReserveApiRequestBody>,
  'path'
>
export type MessageCancelReserveApiResponse = MessageApiResponseBase
