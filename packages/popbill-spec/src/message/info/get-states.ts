import type { MessageApiRequest, MessageRequireRequestFields } from '../common'

/** @see https://developers.popbill.com/api-reference/sms/api/info */
export type MessageGetStatesApiRequestPath = never
export type MessageGetStatesApiRequestQuery = never
export type MessageGetStatesApiRequestBody = string[]
export type MessageGetStatesApiRequest = MessageRequireRequestFields<
  MessageApiRequest<MessageGetStatesApiRequestPath, MessageGetStatesApiRequestQuery, MessageGetStatesApiRequestBody>,
  'body'
>
/** The legacy SDK returns the response unchanged; current provider documentation does not define its schema. */
export type MessageGetStatesApiResponse = unknown
