import type { MessageType } from '@connextable/popbill-spec'
export interface MessageOperationResult {
  code: number
  message: string
}
export interface MessageAccessURL {
  url: string
}
export interface MessageReceiptResult {
  receiptNumber: string
}
export interface SentMessage {
  receiptNumber?: string
  requestNumber?: string
  referenceKey?: string
  messageType?: MessageType
  senderNumber?: string
  senderName?: string
  receiverNumber?: string
  receiverName?: string
  subject?: string
  body?: string
  carrierName?: string
  stateCode?: string
  resultCode?: string
  receivedAt?: string
  reservedAt?: string
  sentAt?: string
  resultReceivedAt?: string
}
export interface MessageSearchResult extends MessageOperationResult {
  pageNumber: number
  pageSize: number
  pageCount: number
  totalCount: number
  items: SentMessage[]
}
export interface MessageSenderNumber {
  number: string
  isRepresentative?: boolean
  stateCode?: number
  memo?: string
}
export interface MessageDeniedNumber {
  number: string
  registeredAt?: string
}
export interface MessageDenyNumberInfo {
  number?: string
  registeredAt?: string
}
export interface MessageChargeInfo {
  unitCost?: string
  chargeMethod?: '연동' | '파트너'
  rateSystem?: string
}
export interface MessageUnitCost {
  unitCost: string
}
