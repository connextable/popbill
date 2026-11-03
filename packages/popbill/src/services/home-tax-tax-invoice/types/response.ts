export interface HomeTaxTaxInvoiceOperationResult {
  resultCode: number
  resultMessage: string
}
export interface HomeTaxTaxInvoiceAccessUrl {
  accessUrl: string
}
export interface HomeTaxTaxInvoiceJobReceipt {
  /** 요청 시점부터 1시간 유효합니다. 만료 후에는 새 수집 작업이 필요합니다. */
  jobId: string
}
export interface HomeTaxTaxInvoiceJobState {
  jobId?: string
  invoiceDirection?: string
  searchDateType?: string
  startDate?: string
  endDate?: string
  stateCode?: number | string | null
  resultCode?: number | string | null
  resultMessage?: string
  collectedCount?: number
  /** stateCode가 3이고 resultCode를 안전한 정수로 해석한 값이 1인 경우에만 true입니다. */
  isSearchable: boolean
  requestedAt?: string
  startedAt?: string
  completedAt?: string
}
export interface HomeTaxTaxInvoiceParty {
  businessNumber?: string
  managementKey?: string
  taxRegistrationId?: string
  companyName?: string
  representativeName?: string
  address?: string
  businessType?: string
  businessCategory?: string
  partyType?: string
  contactName?: string
  departmentName?: string
  phoneNumber?: string
  emailAddress?: string
  secondaryContactName?: string
  secondaryDepartmentName?: string
  secondaryPhoneNumber?: string
  secondaryEmailAddress?: string
}
export interface HomeTaxTaxInvoiceLineItem {
  sequenceNumber?: number
  itemName?: string
  specification?: string
  quantity?: string
  unitCost?: string
  supplyCostAmount?: string
  taxAmount?: string
  remark?: string
  transactionDate?: string
}
export interface HomeTaxTaxInvoiceSummary {
  confirmationNumber?: string
  originalConfirmationNumber?: string
  invoiceDirection?: string
  taxType?: string
  purposeType?: string
  isModified?: boolean
  supplier: HomeTaxTaxInvoiceParty
  recipient: HomeTaxTaxInvoiceParty
  trustee: HomeTaxTaxInvoiceParty
  totalSupplyCostAmount?: string
  totalTaxAmount?: string
  totalAmount?: string
  firstLineItem: HomeTaxTaxInvoiceLineItem
  remark?: string
  writtenDate?: string
  issuedDate?: string
  sentDate?: string
}
export interface HomeTaxTaxInvoiceDocument {
  confirmationNumber?: string
  originalConfirmationNumber?: string
  serialNumber?: string
  invoiceTypeCode?: number
  taxType?: string
  purposeType?: string
  modificationReasonCode?: number
  supplier: HomeTaxTaxInvoiceParty
  recipient: HomeTaxTaxInvoiceParty
  trustee: HomeTaxTaxInvoiceParty
  totalSupplyCostAmount?: string
  totalTaxAmount?: string
  totalAmount?: string
  cashAmount?: string
  checkAmount?: string
  creditAmount?: string
  noteAmount?: string
  lineItems: HomeTaxTaxInvoiceLineItem[]
  remark1?: string
  remark2?: string
  remark3?: string
  writtenDate?: string
  issuedAt?: string
}
export interface HomeTaxTaxInvoiceSearchResult {
  resultCode: number
  pageNumber?: number
  pageSize?: number
  pageCount?: number
  totalCount?: number
  invoices: HomeTaxTaxInvoiceSummary[]
}
export interface HomeTaxTaxInvoiceTotals {
  count?: number
  /** 합계 API는 공식 계약에 따라 숫자로 반환합니다. */
  totalSupplyCostAmount?: number
  totalTaxAmount?: number
  totalAmount?: number
}
export interface HomeTaxTaxInvoiceXmlResult extends HomeTaxTaxInvoiceOperationResult {
  xml: string
}
export interface HomeTaxTaxInvoiceCertificateExpiration {
  expiresAt: string
}
export interface HomeTaxTaxInvoiceFlatRateState {
  businessNumber?: string
  stateCode?: number
  terminationRequested?: boolean
  usageRestricted?: boolean
  terminateOnExpiration?: boolean
  hasUnpaidBalance?: boolean
  billingDay?: number
  contractedAt?: string
  expiresOn?: string
}
export interface HomeTaxTaxInvoiceChargeInfo {
  unitCost?: string
  chargeMethod?: string
  rateSystem?: string
}
