import type { ProviderBoolean, ProviderNumericCode } from '@/internal/response'
import type { CashbillBuyerInput, CashbillDocumentInput, CashbillMerchantInput, CashbillPaymentInput } from './document'

export interface CashbillOperationResult {
  resultCode: ProviderNumericCode | undefined
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
  processingStateCode?: ProviderNumericCode
  processingResultCode?: ProviderNumericCode
  issueResults: CashbillBulkIssueResult[]
  receivedAt?: string
  processingStartedAt?: string
  processingCompletedAt?: string
}

export interface CashbillInfo extends CashbillDocumentOutput {
  itemKey?: string
  stateCode?: ProviderNumericCode
  stateMemo?: string
  nationalTaxServiceResultCode?: ProviderNumericCode
  nationalTaxServiceResultMessage?: string
  isPrinted?: ProviderBoolean
  isIssuedThroughAPI?: ProviderBoolean
  registeredAt?: string
  issuedAt?: string
  stateChangedAt?: string
  nationalTaxServiceSentAt?: string
  nationalTaxServiceResultReceivedAt?: string
}

export interface CashbillDocumentOutput extends Partial<
  Omit<
    CashbillDocumentInput,
    'transactionType' | 'usageType' | 'tradeOption' | 'taxType' | 'merchant' | 'buyer' | 'payment' | 'cancellationReason' | 'sendTextMessage'
  >
> {
  transactionType?: string | null
  usageType?: string | null
  tradeOption?: string | null
  taxType?: string | null
  merchant?: Partial<CashbillMerchantInput>
  buyer?: Partial<CashbillBuyerInput>
  payment?: Partial<CashbillPaymentInput>
  cancellationReason?: ProviderNumericCode
  sendTextMessage?: ProviderBoolean
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
  documentLogTypeCode?: ProviderNumericCode
  logMessage?: string
  processTypeCode?: ProviderNumericCode
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
  emailTypeCode?: ProviderNumericCode
  sendEnabled?: ProviderBoolean
}
export interface CashbillChargeInfo {
  unitCost?: string
  chargeMethod?: string | null
  rateSystem?: string | null
}
export interface CashbillUnitCost {
  unitCost: string
}
