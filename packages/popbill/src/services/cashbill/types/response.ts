import type { CashbillBuyerInput, CashbillDocumentInput, CashbillMerchantInput, CashbillPaymentInput } from './document'

export interface CashbillOperationResult {
  resultCode: number
  resultMessage: string
}
export interface CashbillIssueResult extends CashbillOperationResult {
  confirmationNumber?: string
  transactionDate?: string
  transactedAt?: string
  issuedAt?: string
}

export interface CashbillBulkSubmissionResult extends CashbillOperationResult {
  receiptIdentifier?: string
}
export interface CashbillBulkIssueResult extends CashbillIssueResult {
  managementKey?: string
}
export interface CashbillBulkResult extends CashbillOperationResult {
  submissionIdentifier?: string
  receiptIdentifier?: string
  submittedCount?: number
  successCount?: number
  failureCount?: number
  processingStateCode?: number
  processingResultCode?: number
  issueResults: CashbillBulkIssueResult[]
  receivedAt?: string
  processingStartedAt?: string
  processingCompletedAt?: string
}

export interface CashbillInfo extends CashbillDocumentOutput {
  itemKey?: string
  stateCode?: number
  stateMemo?: string
  nationalTaxServiceResultCode?: string
  nationalTaxServiceResultMessage?: string
  isPrinted?: boolean
  isIssuedThroughAPI?: boolean
  registeredAt?: string
  issuedAt?: string
  stateChangedAt?: string
  nationalTaxServiceSentAt?: string
  nationalTaxServiceResultReceivedAt?: string
}

export interface CashbillDocumentOutput extends Partial<Omit<CashbillDocumentInput, 'merchant' | 'buyer' | 'payment'>> {
  merchant?: Partial<CashbillMerchantInput>
  buyer?: Partial<CashbillBuyerInput>
  payment?: Partial<CashbillPaymentInput>
  confirmationNumber?: string
  transactionDate?: string
  historyMemo?: string
  emailSubject?: string
}
export interface CashbillManagementKeyUsage {
  isInUse: boolean
}

export interface CashbillSearchResult {
  operationResult: CashbillOperationResult
  pageNumber?: number
  pageSize?: number
  pageCount?: number
  totalCount?: number
  cashbillSummaries: CashbillInfo[]
}

export interface CashbillLogEntry {
  documentLogTypeCode?: number
  logMessage?: string
  processTypeCode?: string
  processCompanyName?: string
  processContactName?: string
  processDescription?: string
  registeredAt?: string
  ipAddress?: string
}

export interface CashbillAccessUrl {
  accessUrl: string
}
export interface CashbillEmailSendSetting {
  emailTypeCode?: string
  sendEnabled?: boolean
}
export interface CashbillChargeInfo {
  unitCost?: string
  chargeMethod?: string
  rateSystem?: string
}
export interface CashbillUnitCost {
  unitCost: string
}
