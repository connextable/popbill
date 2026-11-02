export type FaxReceiveNumberType = '일반' | '지능'
export interface FaxBusinessInput {
  businessNumber: string
}
export interface FaxRecipient {
  phoneNumber: string
  name?: string
  partnerReferenceKey?: string
}
export interface FaxSendInput extends FaxBusinessInput {
  /** Caller-assigned identifier. Retain it to query a lost receipt response. */
  requestNumber?: string
  senderPhoneNumber: string
  senderName?: string
  recipients: readonly FaxRecipient[]
  title?: string
  isAdvertisement?: boolean
  /** yyyyMMddHHmmss, omitted for immediate sending. */
  scheduledAt?: string
}
export interface SendFaxFromPathsInput extends FaxSendInput {
  filePaths: readonly string[]
}
export interface SendFaxFromBinaryInput extends FaxSendInput {
  files: readonly { fileName: string; fileData: Buffer }[]
}
export interface FaxReceiptInput extends FaxBusinessInput {
  receiptNumber: string
}
export interface FaxRequestInput extends FaxBusinessInput {
  requestNumber: string
}
export interface FaxResendOverrides {
  newRequestNumber?: string
  senderPhoneNumber?: string
  senderName?: string
  /** Omitted recipients retain the original recipients. */
  recipients?: readonly FaxRecipient[]
  title?: string
  scheduledAt?: string
}
export interface ResendFaxByReceiptInput extends FaxReceiptInput, FaxResendOverrides {}
export interface ResendFaxByRequestInput extends FaxRequestInput, FaxResendOverrides {}
export interface CheckFaxSenderInput extends FaxBusinessInput {
  senderPhoneNumber: string
}
export interface FaxPricingInput extends FaxBusinessInput {
  receiveNumberType?: FaxReceiveNumberType
}
export interface SearchFaxesInput extends FaxBusinessInput {
  /** yyyyMMdd; provider accepts a maximum two-month search interval. */
  startDate: string
  endDate: string
  /** Known codes: 1 (pending), 2 (sending), 3 (complete), 4 (cancelled). New provider codes are forwarded. */
  stateCodes?: readonly string[]
  scheduledOnly?: boolean
  currentUserOnly?: boolean
  queryText?: string
  sortOrder?: 'A' | 'D'
  pageNumber?: number
  pageSize?: number
}
