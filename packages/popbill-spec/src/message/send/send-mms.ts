import type { MessageApiRequest, MessageRequireRequestFields, MessageReceiptApiResponse } from '../common'
import type { MessageMmsApiBody } from '../models'

/** @see https://developers.popbill.com/api-reference/sms/api/send */
export type MessageSendMMSApiRequestPath = never
export type MessageSendMMSApiRequestQuery = never
export type MessageSendMMSApiRequestBody = MessageMmsApiBody
export type MessageSendMMSApiRequest = MessageRequireRequestFields<
  MessageApiRequest<MessageSendMMSApiRequestPath, MessageSendMMSApiRequestQuery, MessageSendMMSApiRequestBody>,
  'body'
>
export type MessageSendMMSApiResponse = MessageReceiptApiResponse
