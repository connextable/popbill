import type { MessageApiRequest, MessageRequireRequestFields, MessageReceiptApiResponse } from '../common'
import type { MessageSendApiBody } from '../models'

/** @see https://developers.popbill.com/api-reference/sms/api/send */
export type MessageSendSMSApiRequestPath = never
export type MessageSendSMSApiRequestQuery = never
export type MessageSendSMSApiRequestBody = MessageSendApiBody
export type MessageSendSMSApiRequest = MessageRequireRequestFields<
  MessageApiRequest<MessageSendSMSApiRequestPath, MessageSendSMSApiRequestQuery, MessageSendSMSApiRequestBody>,
  'body'
>
export type MessageSendSMSApiResponse = MessageReceiptApiResponse
