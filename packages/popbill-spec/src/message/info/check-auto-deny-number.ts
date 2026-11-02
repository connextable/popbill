import type { MessageApiRequest } from '../common'
import type { MessageAutoDenyNumberApiResponse } from '../models'

/** @see https://developers.popbill.com/api-reference/sms/api/info */
export type MessageCheckAutoDenyNumberApiRequestPath = never
export type MessageCheckAutoDenyNumberApiRequestQuery = never
export type MessageCheckAutoDenyNumberApiRequestBody = never
export type MessageCheckAutoDenyNumberApiRequest = MessageApiRequest<
  MessageCheckAutoDenyNumberApiRequestPath,
  MessageCheckAutoDenyNumberApiRequestQuery,
  MessageCheckAutoDenyNumberApiRequestBody
>
export type MessageCheckAutoDenyNumberApiResponse = MessageAutoDenyNumberApiResponse
