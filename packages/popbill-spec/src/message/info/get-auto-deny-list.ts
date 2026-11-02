import type { MessageApiRequest } from '../common'
import type { MessageAutoDenyApiModel } from '../models'

/** @see https://developers.popbill.com/api-reference/sms/api/info */
export type MessageGetAutoDenyListApiRequestPath = never
export type MessageGetAutoDenyListApiRequestQuery = never
export type MessageGetAutoDenyListApiRequestBody = never
export type MessageGetAutoDenyListApiRequest = MessageApiRequest<
  MessageGetAutoDenyListApiRequestPath,
  MessageGetAutoDenyListApiRequestQuery,
  MessageGetAutoDenyListApiRequestBody
>
export type MessageGetAutoDenyListApiResponse = MessageAutoDenyApiModel[]
