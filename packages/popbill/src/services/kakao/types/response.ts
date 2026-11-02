import type { KakaoButton, KakaoContent } from './document'
export interface KakaoOperationResult {
  resultCode: number
  resultMessage: string
}
export interface KakaoReceipt {
  receiptNumber: string
}
export interface KakaoAccessUrl {
  accessUrl: string
}
export interface KakaoUnitCost {
  unitCostAmount: string
}
export interface KakaoChargeInfo extends KakaoUnitCost {
  chargeMethod: string
  rateSystem: string
}
export interface KakaoBusinessChannel {
  channelSearchId: string
  channelName?: string
  stateCode?: string
  brandMessagingStateCode?: number
  registeredAt?: string
  stateChangedAt?: string
  brandMessagingStateChangedAt?: string
}
export interface KakaoSenderNumber {
  phoneNumber: string
  representative?: boolean
  stateCode?: number
  memo?: string | null
}
export interface KakaoNotificationTemplate {
  channelSearchId?: string
  templateCode: string
  templateName?: string
  messageBody?: string
  advertisingText?: string
  appendix?: string
  buttons?: KakaoButton[]
  secure?: boolean
  emphasisType?: string
  emphasizedTitle?: string
  emphasizedSubtitle?: string
  stateCode?: string
  stateChangedAt?: string
}
export interface KakaoBrandTemplate extends KakaoContent {
  templateCode: string
  templateName?: string
  channelSearchId?: string
  templateType?: string
  stateCode?: number
  stateChangedAt?: string
}
export interface KakaoMessage extends KakaoContent {
  receiptNumber?: string
  requestNumber?: string
  referenceKey?: string
  channelSearchId?: string
  templateCode?: string
  messageType?: string
  contentTypeCode?: number | string
  senderPhoneNumber?: string
  receiverPhoneNumber?: string
  receiverName?: string
  subject?: string
  emphasizedTitle?: string
  stateCode?: number
  resultCode?: number
  receivedAt?: string
  reserveDateTime?: string
  sentAt?: string
  resultAt?: string
  fallbackSubject?: string
  fallbackBody?: string
  fallbackContentTypeCode?: number
  fallbackResultCode?: number | string
  fallbackSentAt?: string
  fallbackResultAt?: string
}
export interface KakaoMessages {
  receiptNumber?: string
  requestNumber?: string
  channelSearchId?: string
  templateCode?: string
  brandTemplateCode?: string
  contentTypeCode?: number | string
  target?: string
  senderPhoneNumber?: string
  messageBody?: string
  buttons?: KakaoButton[]
  messages: KakaoMessage[]
  advertising?: boolean
  unsubscribePhoneNumber?: string
  sentCount?: string
  successCount?: string
  failureCount?: string
  canceledCount?: string
  sendDateTime?: string
  reserveDateTime?: string
  fallbackSubject?: string
  fallbackBody?: string
  fallbackType?: string | null
  fallbackUnsubscribePhoneNumber?: string
  fallbackCount?: string
}
export interface KakaoSearchResult {
  operationResult: KakaoOperationResult
  pageNumber: number
  pageSize: number
  pageCount: number
  totalCount: number
  messages: KakaoMessage[]
}
export interface KakaoImage {
  imageUrl: string
  formField?: string
}
