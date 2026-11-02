import type { MessageApiRequest, MessageRequireRequestFields } from '../common'
import type { MessageSentApiModel } from '../models'

/** @see https://developers.popbill.com/api-reference/sms/api/info */
export type MessageGetMessagesRNApiRequestPath = { requestNum: string }
export type MessageGetMessagesRNApiRequestQuery = never
export type MessageGetMessagesRNApiRequestBody = never
export type MessageGetMessagesRNApiRequest = MessageRequireRequestFields<
  MessageApiRequest<MessageGetMessagesRNApiRequestPath, MessageGetMessagesRNApiRequestQuery, MessageGetMessagesRNApiRequestBody>,
  'path'
>
export type MessageGetMessagesRNApiResponse = MessageSentApiModel[]
