import type { StatementDocumentInput, StatementItemCode } from './document'

export interface StatementOperationResult {
  resultCode: number
  resultMessage: string
}

export interface StatementIssueResult extends StatementOperationResult {
  documentNumber?: string
  issuedAt?: string
}

export interface StatementPartySummary {
  businessNumber?: string
  companyName?: string
  printEnabled?: boolean
}

/** 저장·발행 상태를 포함한 전자명세서 요약입니다. */
export interface StatementInfo {
  documentTypeCode?: StatementItemCode
  itemKey?: string
  documentNumber?: string
  managementKey?: string
  taxType?: string
  purposeType?: string
  sender?: StatementPartySummary
  receiver?: StatementPartySummary
  totalSupplyCostAmount?: string
  totalTaxAmount?: string
  stateCode?: number
  stateMemo?: string
  isOpen?: boolean
  writtenDate?: string
  registeredAt?: string
  issuedAt?: string
  stateChangedAt?: string
  openedAt?: string
}

/** 서버가 생략한 필드는 생략한 상태로 반환합니다. */
export interface StatementDocumentOutput extends Partial<StatementDocumentInput> {
  documentNumber?: string
  autoAcceptEnabled?: boolean
  sendFAXEnabled?: boolean
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
  documentLogTypeCode?: number
  logMessage?: string
  processTypeCode?: string
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
  emailTypeCode?: string
  sendEnabled?: boolean
}

export interface StatementChargeInfo {
  unitCost?: string
  chargeMethod?: string
  rateSystem?: string
}

export interface StatementUnitCost {
  unitCost: string
}
