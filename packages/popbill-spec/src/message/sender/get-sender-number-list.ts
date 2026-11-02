import type { MessageApiRequest } from '../common'
import type { MessageSenderNumberApiModel } from '../models'

/** @see https://developers.popbill.com/api-reference/sms/api/sendnum */
export type MessageGetSenderNumberListApiRequestPath = never
export type MessageGetSenderNumberListApiRequestQuery = never
export type MessageGetSenderNumberListApiRequestBody = never
export type MessageGetSenderNumberListApiRequest = MessageApiRequest<
  MessageGetSenderNumberListApiRequestPath,
  MessageGetSenderNumberListApiRequestQuery,
  MessageGetSenderNumberListApiRequestBody
>
export type MessageGetSenderNumberListApiResponse = MessageSenderNumberApiModel[]
