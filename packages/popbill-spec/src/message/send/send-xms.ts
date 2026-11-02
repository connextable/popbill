import type { MessageApiRequest, MessageRequireRequestFields, MessageReceiptApiResponse } from '../common'
import type { MessageSendApiBody } from '../models'

/** @see https://developers.popbill.com/api-reference/sms/api/send */
export type MessageSendXMSApiRequestPath = never
export type MessageSendXMSApiRequestQuery = never
export type MessageSendXMSApiRequestBody = MessageSendApiBody
export type MessageSendXMSApiRequest = MessageRequireRequestFields<
  MessageApiRequest<MessageSendXMSApiRequestPath, MessageSendXMSApiRequestQuery, MessageSendXMSApiRequestBody>,
  'body'
>
export type MessageSendXMSApiResponse = MessageReceiptApiResponse
