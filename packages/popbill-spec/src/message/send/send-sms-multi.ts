import type { MessageApiRequest, MessageRequireRequestFields, MessageReceiptApiResponse } from '../common'
import type { MessageSendApiBody } from '../models'

/** @see https://developers.popbill.com/api-reference/sms/api/send */
export type MessageSendSMSMultiApiRequestPath = never
export type MessageSendSMSMultiApiRequestQuery = never
export type MessageSendSMSMultiApiRequestBody = MessageSendApiBody
export type MessageSendSMSMultiApiRequest = MessageRequireRequestFields<
  MessageApiRequest<MessageSendSMSMultiApiRequestPath, MessageSendSMSMultiApiRequestQuery, MessageSendSMSMultiApiRequestBody>,
  'body'
>
export type MessageSendSMSMultiApiResponse = MessageReceiptApiResponse
