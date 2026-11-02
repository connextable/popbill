import type { FaxReceiveNumberType } from './request'

export interface FaxOperationResult {
  code: number
  message: string
}
export interface FaxAccessURL {
  url: string
}
export interface FaxReceipt {
  receiptNumber: string
}
export interface FaxResult {
  receiptNumber?: string
  requestNumber?: string
  partnerReferenceKey?: string
  senderPhoneNumber?: string
  senderName?: string
  recipientPhoneNumber?: string
  recipientName?: string
  recipientNumberType?: FaxReceiveNumberType
  title?: string
  fileNames?: string[]
  convertedFileSize?: string
  stateCode: number
  resultCode?: number
  sentPageCount?: number
  successfulPageCount?: number
  failedPageCount?: number
  cancelledPageCount?: number
  chargedPageCount?: number
  refundedPageCount?: number
  receivedAt?: string
  scheduledAt?: string
  sentAt?: string
  resultReceivedAt?: string
}
export interface FaxSearchResult extends FaxOperationResult {
  pageNumber: number
  pageSize: number
  pageCount: number
  totalCount: number
  items: FaxResult[]
}
export interface FaxSenderNumber {
  phoneNumber: string
  isRepresentative: boolean
  stateCode: number
  memo?: string
}
export interface FaxChargeInfo {
  unitCost: string
  chargeMethod: string
  rateSystem: string
}
export interface FaxUnitCost {
  unitCost: string
}
