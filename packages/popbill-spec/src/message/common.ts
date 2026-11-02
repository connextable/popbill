import type { PopbillApiRequest, PopbillRequireRequestFields } from '../request'

export type MessageApiRequest<TPath = never, TQuery = never, TBody = never> = PopbillApiRequest<TPath, TQuery, TBody>
export type MessageRequireRequestFields<T, K extends keyof T> = PopbillRequireRequestFields<T, K>
export type MessageType = 'SMS' | 'LMS' | 'MMS'
export type MessageSendType = MessageType | 'XMS'
export interface MessageApiResponseBase {
  code: number
  message: string
}
export interface MessageUrlApiResponse {
  url: string
}
export interface MessageReceiptApiResponse {
  receiptNum: string
}
