import type { MessageApiRequest, MessageRequireRequestFields, MessageReceiptApiResponse } from '../common'
import type { MessageSendApiBody } from '../models'

/** @see https://developers.popbill.com/api-reference/sms/api/send */
export type MessageSendLMSMultiApiRequestPath = never
export type MessageSendLMSMultiApiRequestQuery = never
export type MessageSendLMSMultiApiRequestBody = MessageSendApiBody
export type MessageSendLMSMultiApiRequest = MessageRequireRequestFields<
  MessageApiRequest<MessageSendLMSMultiApiRequestPath, MessageSendLMSMultiApiRequestQuery, MessageSendLMSMultiApiRequestBody>,
  'body'
>
export type MessageSendLMSMultiApiResponse = MessageReceiptApiResponse
