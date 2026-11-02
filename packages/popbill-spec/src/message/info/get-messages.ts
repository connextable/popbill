import type { MessageApiRequest, MessageRequireRequestFields } from '../common'
import type { MessageSentApiModel } from '../models'

/** @see https://developers.popbill.com/api-reference/sms/api/info */
export type MessageGetMessagesApiRequestPath = { receiptNum: string }
export type MessageGetMessagesApiRequestQuery = never
export type MessageGetMessagesApiRequestBody = never
export type MessageGetMessagesApiRequest = MessageRequireRequestFields<
  MessageApiRequest<MessageGetMessagesApiRequestPath, MessageGetMessagesApiRequestQuery, MessageGetMessagesApiRequestBody>,
  'path'
>
export type MessageGetMessagesApiResponse = MessageSentApiModel[]
