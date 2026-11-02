import type { MessageApiRequest, MessageRequireRequestFields, MessageType } from '../common'
import type { MessageChargeInfoApiResponse } from '../models'

/** @see https://developers.popbill.com/api-reference/sms/common-api/point */
export type MessageGetChargeInfoApiRequestPath = never
export type MessageGetChargeInfoApiRequestQuery = { Type: MessageType }
export type MessageGetChargeInfoApiRequestBody = never
export type MessageGetChargeInfoApiRequest = MessageRequireRequestFields<
  MessageApiRequest<MessageGetChargeInfoApiRequestPath, MessageGetChargeInfoApiRequestQuery, MessageGetChargeInfoApiRequestBody>,
  'query'
>
export type MessageGetChargeInfoApiResponse = MessageChargeInfoApiResponse
