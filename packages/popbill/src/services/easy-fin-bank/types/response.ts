export interface EasyFinBankOperationResult {
  code: number
  message: string
}
export interface EasyFinBankAccessURL {
  url: string
}
export interface EasyFinBankChargeInfo {
  unitCost: string
  chargeMethod: string
  rateSystem: string
}
export interface EasyFinBankSubscription {
  accountReferenceId: string
  stateCode: number
  isClosureRequested: boolean
  isUseRestricted: boolean
  closesOnExpiration: boolean
  hasUnpaidBalance: boolean
  renewalDay: number
  startedAt: string
  expiresOn: string
}
export interface EasyFinBankAccount {
  bankCode: string
  accountNumber: string
  accountName: string
  accountType: '법인' | '개인' | (string & {})
  memo: string
  accountStateCode: number
  subscriptionStateCode: number
  isClosureRequested: boolean
  isUseRestricted: boolean
  closesOnExpiration: boolean
  hasUnpaidBalance: boolean
  subscriptionRenewalDay: number
  registeredAt: string
  subscriptionStartedAt: string
  subscriptionExpiresOn: string
}
export interface EasyFinBankCollectionReceipt {
  collectionId: string
}
export interface EasyFinBankCollectionStatus {
  collectionId: string
  startDate: string
  endDate: string
  /** 0 received, 1 waiting, 2 collecting, 3 completed (including failure). */
  stateCode: number | string | null
  resultCode: number
  resultMessage: string
  /** Search only when stateCode is 3 and resultCode is 1. */
  isSuccessful: boolean
  requestedAt: string
  startedAt: string
  completedAt: string
}
export interface EasyFinBankTransaction {
  transactionId: string
  transactionSequence: number
  depositAmount: string
  withdrawalAmount: string
  balance: string
  remark1: string
  remark2: string
  remark3: string
  remark4: string
  memo: string
  transactionDate: string
  transactedAt: string
  registeredAt: string
}
export interface EasyFinBankTransactionSearchResult extends EasyFinBankOperationResult {
  balance: string
  pageNumber: number
  pageSize: number
  pageCount: number
  totalCount: number
  transactions: EasyFinBankTransaction[]
  lastCollectedAt: string
}
export interface EasyFinBankTransactionSummary {
  transactionCount: number
  depositCount: number
  withdrawalCount: number
  totalDepositAmount: number
  totalWithdrawalAmount: number
}
