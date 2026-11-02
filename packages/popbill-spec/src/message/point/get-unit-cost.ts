import type { MessageApiRequest, MessageRequireRequestFields, MessageType } from '../common'

/** @see https://developers.popbill.com/api-reference/sms/common-api/point */
export type MessageGetUnitCostApiRequestPath = never
export type MessageGetUnitCostApiRequestQuery = { Type: MessageType }
export type MessageGetUnitCostApiRequestBody = never
export type MessageGetUnitCostApiRequest = MessageRequireRequestFields<
  MessageApiRequest<MessageGetUnitCostApiRequestPath, MessageGetUnitCostApiRequestQuery, MessageGetUnitCostApiRequestBody>,
  'query'
>
export type MessageGetUnitCostApiResponse = { unitCost: string }
