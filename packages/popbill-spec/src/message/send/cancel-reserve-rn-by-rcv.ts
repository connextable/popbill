import type { MessageApiRequest, MessageRequireRequestFields, MessageApiResponseBase } from '../common'

/** @see https://developers.popbill.com/api-reference/sms/api/send */
export type MessageCancelReserveRNbyRCVApiRequestPath = { requestNum: string }
export type MessageCancelReserveRNbyRCVApiRequestQuery = never
export type MessageCancelReserveRNbyRCVApiRequestBody = { receiveNum: string }
export type MessageCancelReserveRNbyRCVApiRequest = MessageRequireRequestFields<
  MessageApiRequest<MessageCancelReserveRNbyRCVApiRequestPath, MessageCancelReserveRNbyRCVApiRequestQuery, MessageCancelReserveRNbyRCVApiRequestBody>,
  'path' | 'body'
>
export type MessageCancelReserveRNbyRCVApiResponse = MessageApiResponseBase
