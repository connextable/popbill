import type { CommonCompanyInfo, CommonContactInput } from './document'
export interface CommonOperationResult {
  resultCode: number
  resultMessage: string
}
export interface CommonHistoryResult<T> {
  resultCode: number
  resultMessage?: string
  pageNumber: number
  pageSize: number
  pageCount: number
  totalCount: number
  items: T[]
}
export interface CommonMembershipStatus extends CommonOperationResult {
  isMember: boolean
}
export interface CommonUserIdUsage extends CommonOperationResult {
  isInUse: boolean
}
export type CommonCompany = CommonCompanyInfo
export interface CommonContact extends CommonContactInput {
  isManager?: boolean
  stateCode?: number
  registeredAt?: string
}
export interface CommonAccessURL {
  accessUrl: string
}
export interface CommonPointBalance {
  remainingPoints: string
}
export interface CommonPaymentReceipt {
  settlementCode: string
  resultCode: number
  resultMessage: string
}
export interface CommonPaymentHistory {
  productType?: string
  productName?: string
  paymentType?: string
  contactName?: string
  contactEmailAddress?: string
  paymentAmount?: string
  chargedPoints?: string
  stateCode?: number
  registeredAt?: string
  stateChangedAt?: string
}
export interface CommonPointUseHistory {
  serviceCode?: number
  serviceUserId?: string
  userId?: string
  userName?: string
  transactionPoints?: string
  remainingPoints?: string
  transactionTypeCode?: number
  transactedAt?: string
}
export interface CommonRefundableBalance {
  refundablePoints: string
}
export interface CommonRefundReceipt {
  refundCode: string
  resultCode: number
  resultMessage: string
}
export interface CommonRefundHistory {
  bankName?: string
  accountNumber?: string
  accountHolderName?: string
  requestedPoints?: string
  reason?: string
  stateCode?: number
  requestedAt?: string
}
