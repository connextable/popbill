import type { MessageType } from '@connextable/popbill-spec'

export interface MessageBusinessRequest {
  businessNumber: string
}
export interface MessageRecipientInput {
  receiverNumber: string
  receiverName?: string
  senderNumber?: string
  senderName?: string
  subject?: string
  body?: string
  referenceKey?: string
}
export interface SendMessageRequest extends MessageBusinessRequest {
  requestNumber?: string
  senderNumber: string
  senderName?: string
  recipients: readonly MessageRecipientInput[]
  subject?: string
  body: string
  isAdvertisement?: boolean
  reservedAt?: string
}
export type MessageImageInput = { filePath: string; fileName?: never; fileData?: never } | { filePath?: never; fileName: string; fileData: Buffer }
export interface SendImageMessageRequest extends SendMessageRequest {
  image: MessageImageInput
}
export interface MessageReceiptRequest extends MessageBusinessRequest {
  receiptNumber: string
}
export interface MessageRequestNumberRequest extends MessageBusinessRequest {
  requestNumber: string
}
export interface MessageReceiptRecipientRequest extends MessageReceiptRequest {
  receiverNumber: string
}
export interface MessageRequestRecipientRequest extends MessageRequestNumberRequest {
  receiverNumber: string
}
export interface MessageChargeRequest extends MessageBusinessRequest {
  messageType: MessageType
}
export interface MessageSearchRequest extends MessageBusinessRequest {
  startDate: string
  endDate: string
  stateCodes: readonly string[]
  messageTypes?: readonly MessageType[]
  isReserved?: boolean
  sentByCurrentUserOnly?: boolean
  queryText?: string
  sortOrder?: 'A' | 'D'
  pageNumber?: number
  pageSize?: number
}
