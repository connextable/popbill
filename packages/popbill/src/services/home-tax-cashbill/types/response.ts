export interface HomeTaxCashbillOperationResult {
  code: number
  message: string
}

export interface HomeTaxCashbillCollectionJob {
  jobId: string
}

export interface HomeTaxCashbillCollectionJobState extends HomeTaxCashbillCollectionJob {
  receiptDirection?: string
  dateType?: string
  startDate?: string
  endDate?: string
  /** 1: 대기, 2: 진행, 3: 완료. 완료와 성공은 별개입니다. */
  stateCode: number | string | null
  resultCode?: number
  resultMessage?: string
  collectedCount?: number
  /** stateCode=3이고 resultCode=1인 경우에만 true입니다. */
  collectionSucceeded: boolean
  requestedAt?: string
  startedAt?: string
  completedAt?: string
}

export interface HomeTaxCashbillReceipt {
  ntsConfirmationNumber?: string
  receiptDirection?: string
  tradeType?: string
  tradeUsage?: string
  franchiseBusinessNumber?: string
  franchiseBusinessName?: string
  franchiseBusinessTypeCode?: number | string | null
  /** 원본에서 마스킹한 식별번호 마지막 4자리입니다. */
  maskedIdentityNumber?: string
  identityNumberTypeCode?: number | string | null
  customerName?: string
  cardOwnerName?: string
  deductionTypeCode?: number | string | null
  supplyAmount?: string
  taxAmount?: string
  serviceFeeAmount?: string
  totalAmount?: string
  tradeDate?: string
  tradedAt?: string
}

export interface HomeTaxCashbillSearchResult {
  code: number
  message?: string
  pageNumber?: number
  pageSize?: number
  pageCount?: number
  totalCount?: number
  receipts: HomeTaxCashbillReceipt[]
}

export interface HomeTaxCashbillSummary {
  receiptCount: number
  supplyAmountTotal: number
  taxAmountTotal: number
  serviceFeeAmountTotal: number
  totalAmount: number
}

export interface HomeTaxCashbillAccessUrl {
  url: string
}
export interface HomeTaxCashbillCertificateExpiration {
  /** 원본 yyyyMMddHHmmss를 보존합니다. */
  expiresAt: string
}
export interface HomeTaxCashbillFlatRateState {
  businessNumber?: string
  stateCode?: number
  cancellationRequested?: boolean
  useRestricted?: boolean
  cancelOnExpiration?: boolean
  hasUnpaidBalance?: boolean
  renewalPaymentDay?: number
  contractStartedAt?: string
  expiresOn?: string
}
export interface HomeTaxCashbillChargeInfo {
  unitCost?: string
  chargeMethod?: '연동' | '파트너' | (string & {})
  rateSystem?: '정액제' | '종량제' | (string & {})
}
