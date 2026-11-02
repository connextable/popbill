import type { MessageApiRequest, MessageRequireRequestFields, MessageReceiptApiResponse } from '../common'
import type { MessageMmsApiBody } from '../models'

/** @see https://developers.popbill.com/api-reference/sms/api/send */
export type MessageSendMMSMultiApiRequestPath = never
export type MessageSendMMSMultiApiRequestQuery = never
export type MessageSendMMSMultiApiRequestBody = MessageMmsApiBody
export type MessageSendMMSMultiApiRequest = MessageRequireRequestFields<
  MessageApiRequest<MessageSendMMSMultiApiRequestPath, MessageSendMMSMultiApiRequestQuery, MessageSendMMSMultiApiRequestBody>,
  'body'
>
export type MessageSendMMSMultiApiResponse = MessageReceiptApiResponse
