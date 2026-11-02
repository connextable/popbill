import type { MessageApiRequest, MessageRequireRequestFields, MessageReceiptApiResponse } from '../common'
import type { MessageSendApiBody } from '../models'

/** @see https://developers.popbill.com/api-reference/sms/api/send */
export type MessageSendXMSMultiApiRequestPath = never
export type MessageSendXMSMultiApiRequestQuery = never
export type MessageSendXMSMultiApiRequestBody = MessageSendApiBody
export type MessageSendXMSMultiApiRequest = MessageRequireRequestFields<
  MessageApiRequest<MessageSendXMSMultiApiRequestPath, MessageSendXMSMultiApiRequestQuery, MessageSendXMSMultiApiRequestBody>,
  'body'
>
export type MessageSendXMSMultiApiResponse = MessageReceiptApiResponse
