import type { MessageApiRequest, MessageRequireRequestFields, MessageUrlApiResponse } from '../common'

/** @see https://developers.popbill.com/api-reference/sms/api/sendnum */
export type MessageGetSenderNumberMgtURLApiRequestPath = never
export type MessageGetSenderNumberMgtURLApiRequestQuery = { TG: 'SENDER' }
export type MessageGetSenderNumberMgtURLApiRequestBody = never
export type MessageGetSenderNumberMgtURLApiRequest = MessageRequireRequestFields<
  MessageApiRequest<
    MessageGetSenderNumberMgtURLApiRequestPath,
    MessageGetSenderNumberMgtURLApiRequestQuery,
    MessageGetSenderNumberMgtURLApiRequestBody
  >,
  'query'
>
export type MessageGetSenderNumberMgtURLApiResponse = MessageUrlApiResponse
