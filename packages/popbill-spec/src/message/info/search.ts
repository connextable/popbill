import type { MessageApiRequest, MessageRequireRequestFields } from '../common'
import type { MessageSearchResultApiModel } from '../models'

/** @see https://developers.popbill.com/api-reference/sms/api/info */
export type MessageSearchApiRequestPath = never
export type MessageSearchApiRequestQuery = {
  SDate: string
  EDate: string
  /** Comma-separated state codes, e.g. 1,2. */
  State: string
  /** Comma-separated message types, e.g. SMS,LMS. */
  Item?: string
  ReserveYN?: boolean
  SenderOnly?: boolean
  QString?: string
  Order?: 'A' | 'D'
  Page?: number
  PerPage?: number
}
export type MessageSearchApiRequestBody = never
export type MessageSearchApiRequest = MessageRequireRequestFields<
  MessageApiRequest<MessageSearchApiRequestPath, MessageSearchApiRequestQuery, MessageSearchApiRequestBody>,
  'query'
>
export type MessageSearchApiResponse = MessageSearchResultApiModel
