import type { MessageApiRequest, MessageRequireRequestFields, MessageUrlApiResponse } from '../common'

/** @see https://developers.popbill.com/api-reference/sms/api/info */
export type MessageGetURLApiRequestPath = never
export type MessageGetURLApiRequestQuery = { TG: string }
export type MessageGetURLApiRequestBody = never
export type MessageGetURLApiRequest = MessageRequireRequestFields<
  MessageApiRequest<MessageGetURLApiRequestPath, MessageGetURLApiRequestQuery, MessageGetURLApiRequestBody>,
  'query'
>
export type MessageGetURLApiResponse = MessageUrlApiResponse
