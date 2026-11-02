import type { MessageApiRequest, MessageRequireRequestFields } from '../common'
import type { MessageReceiptStateApiModel } from '../models'

/** @see https://developers.popbill.com/api-reference/sms/api/info */
export type MessageGetStatesApiRequestPath = never
export type MessageGetStatesApiRequestQuery = never
export type MessageGetStatesApiRequestBody = string[]
export type MessageGetStatesApiRequest = MessageRequireRequestFields<
  MessageApiRequest<MessageGetStatesApiRequestPath, MessageGetStatesApiRequestQuery, MessageGetStatesApiRequestBody>,
  'body'
>
export type MessageGetStatesApiResponse = MessageReceiptStateApiModel[]
