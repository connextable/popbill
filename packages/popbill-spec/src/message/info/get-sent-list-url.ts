import type { MessageApiRequest, MessageRequireRequestFields, MessageUrlApiResponse } from '../common'

/** @see https://developers.popbill.com/api-reference/sms/api/info */
export type MessageGetSentListURLApiRequestPath = never
export type MessageGetSentListURLApiRequestQuery = { TG: 'BOX' }
export type MessageGetSentListURLApiRequestBody = never
export type MessageGetSentListURLApiRequest = MessageRequireRequestFields<
  MessageApiRequest<MessageGetSentListURLApiRequestPath, MessageGetSentListURLApiRequestQuery, MessageGetSentListURLApiRequestBody>,
  'query'
>
export type MessageGetSentListURLApiResponse = MessageUrlApiResponse
