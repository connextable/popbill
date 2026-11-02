import type { MessageApiRequest, MessageRequireRequestFields, MessageApiResponseBase } from '../common'

/** @see https://developers.popbill.com/api-reference/sms/api/sendnum */
export type MessageCheckSenderNumberApiRequestPath = { senderNumber: string }
export type MessageCheckSenderNumberApiRequestQuery = never
export type MessageCheckSenderNumberApiRequestBody = never
export type MessageCheckSenderNumberApiRequest = MessageRequireRequestFields<
  MessageApiRequest<MessageCheckSenderNumberApiRequestPath, MessageCheckSenderNumberApiRequestQuery, MessageCheckSenderNumberApiRequestBody>,
  'path'
>
export type MessageCheckSenderNumberApiResponse = MessageApiResponseBase
