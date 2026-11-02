import type { MessageApiRequest, MessageRequireRequestFields, MessageApiResponseBase } from '../common'

/** @see https://developers.popbill.com/api-reference/sms/api/send */
export type MessageCancelReserveRNApiRequestPath = { requestNum: string }
export type MessageCancelReserveRNApiRequestQuery = never
export type MessageCancelReserveRNApiRequestBody = never
export type MessageCancelReserveRNApiRequest = MessageRequireRequestFields<
  MessageApiRequest<MessageCancelReserveRNApiRequestPath, MessageCancelReserveRNApiRequestQuery, MessageCancelReserveRNApiRequestBody>,
  'path'
>
export type MessageCancelReserveRNApiResponse = MessageApiResponseBase
