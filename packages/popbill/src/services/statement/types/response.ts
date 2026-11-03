import type { ProviderBoolean, ProviderNumericCode } from '@/internal/response'
import type { StatementDocumentInput, StatementLineItemInput } from './document'

export interface StatementOperationResult {
  resultCode: ProviderNumericCode | undefined
  resultMessage: string
}

export interface StatementIssueResult extends StatementOperationResult {
  documentNumber?: string
  issuedAt?: string
}

export interface StatementPartySummary {
  businessNumber?: string
  companyName?: string
  printEnabled?: ProviderBoolean
}

/** 저장·발행 상태를 포함한 전자명세서 요약입니다. */
export interface StatementInfo {
  documentTypeCode?: ProviderNumericCode
  itemKey?: string
  documentNumber?: string
  managementKey?: string
  taxType?: string | null
  purposeType?: string | null
  sender?: StatementPartySummary
  receiver?: StatementPartySummary
  totalSupplyCostAmount?: string
  totalTaxAmount?: string
  stateCode?: ProviderNumericCode
  stateMemo?: string
  isOpen?: ProviderBoolean
  writtenDate?: string
  registeredAt?: string
  issuedAt?: string
  stateChangedAt?: string
  openedAt?: string
}

export interface StatementLineItemOutput extends Omit<StatementLineItemInput, 'lineNumber'> {
  lineNumber?: number
}

/** 서버가 생략한 필드는 생략하고, 알 수 없는 분류와 플래그 값은 보존합니다. */
export interface StatementDocumentOutput extends Partial<
  Omit<
    StatementDocumentInput,
    'documentTypeCode' | 'taxType' | 'purposeType' | 'lineItems' | 'includeBusinessLicenseImage' | 'includeBankBookImage' | 'sendTextMessage'
  >
> {
  documentTypeCode?: ProviderNumericCode
  documentNumber?: string
  taxType?: string | null
  purposeType?: string | null
  lineItems?: StatementLineItemOutput[]
  includeBusinessLicenseImage?: ProviderBoolean
  includeBankBookImage?: ProviderBoolean
  sendTextMessage?: ProviderBoolean
  autoAcceptEnabled?: ProviderBoolean
  sendFAXEnabled?: ProviderBoolean
}

export interface StatementManagementKeyUsage {
  isInUse: boolean
}

export interface StatementSearchResult {
  operationResult: StatementOperationResult
  pageNumber?: number
  pageSize?: number
  pageCount?: number
  totalCount?: number
  statementSummaries: StatementInfo[]
}

export interface StatementLogEntry {
  documentLogTypeCode?: ProviderNumericCode
  logMessage?: string
  processTypeCode?: string | null
  processCompanyName?: string
  processContactName?: string
  processDescription?: string
  registeredAt?: string
  ipAddress?: string
}

export interface StatementAccessUrl {
  accessUrl: string
}

export interface StatementAttachedFile {
  sequenceNumber?: number
  fileIdentifier?: string
  fileSize?: number
  displayName?: string
  registeredAt?: string
}

export interface StatementFAXReceipt {
  receiptNumber: string
}

export interface StatementEmailSendSetting {
  emailTypeCode?: string | null
  sendEnabled?: ProviderBoolean
}

export interface StatementChargeInfo {
  unitCost?: string
  chargeMethod?: string | null
  rateSystem?: string | null
}

export interface StatementUnitCost {
  unitCost: string
}
