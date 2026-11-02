import type { MessageApiRequest, MessageRequireRequestFields, MessageReceiptApiResponse } from '../common'
import type { MessageSendApiBody } from '../models'

/** @see https://developers.popbill.com/api-reference/sms/api/send */
export type MessageSendLMSApiRequestPath = never
export type MessageSendLMSApiRequestQuery = never
export type MessageSendLMSApiRequestBody = MessageSendApiBody
export type MessageSendLMSApiRequest = MessageRequireRequestFields<
  MessageApiRequest<MessageSendLMSApiRequestPath, MessageSendLMSApiRequestQuery, MessageSendLMSApiRequestBody>,
  'body'
>
export type MessageSendLMSApiResponse = MessageReceiptApiResponse
