import type { CashbillApprovalDocumentInput, CashbillCancellationReason, CashbillDocumentInput, CashbillPaymentInput } from './document'
import type * as Response from './response'
export * from './document'
export type * from './response'

export const CashbillDateType = { Registered: 'R', Transacted: 'T', Issued: 'I' } as const
export type CashbillDateType = (typeof CashbillDateType)[keyof typeof CashbillDateType]
export const CashbillSortOrder = { Ascending: 'A', Descending: 'D' } as const
export type CashbillSortOrder = (typeof CashbillSortOrder)[keyof typeof CashbillSortOrder]
export const CashbillBoxScopes = { TemporaryDocumentBox: 'TBOX', IssuedDocumentBox: 'PBOX', CreateDocument: 'WRITE' } as const
export type CashbillBoxScope = (typeof CashbillBoxScopes)[keyof typeof CashbillBoxScopes]

export interface CashbillBusinessRequest {
  businessNumber: string
}
export interface CashbillDocumentRequest extends CashbillBusinessRequest {
  managementKey: string
}

export type CashbillCancellationAmounts =
  | { partialCancellation?: false; payment?: never }
  | { partialCancellation: true; payment: CashbillPaymentInput }
export interface IssueCashbillImmediatelyInput extends RegisterCashbillInput {
  document: CashbillApprovalDocumentInput
  historyMemo?: string
  emailSubject?: string
}
export type RevokeCashbillInput = CashbillDocumentRequest &
  CashbillCancellationAmounts & {
    originalConfirmationNumber: string
    originalTransactionDate: string
    sendTextMessage?: boolean
    historyMemo?: string
    emailSubject?: string
    transactedAt?: string
    cancellationReason?: CashbillCancellationReason
  }
export interface SubmitCashbillsInput extends CashbillBusinessRequest {
  submissionIdentifier: string
  documents: CashbillApprovalDocumentInput[]
  historyMemo?: string
  emailSubject?: string
}
export interface GetCashbillBulkResultInput extends CashbillBusinessRequest {
  submissionIdentifier: string
}
export interface RegisterCashbillInput extends CashbillBusinessRequest {
  document: CashbillDocumentInput
}
export type RegisterCashbillRevocationInput = CashbillDocumentRequest &
  CashbillCancellationAmounts & {
    originalConfirmationNumber: string
    originalTransactionDate: string
    sendTextMessage?: boolean
    cancellationReason?: CashbillCancellationReason
  }
export interface UpdateCashbillInput extends RegisterCashbillInput {
  managementKey: string
}
export interface IssueCashbillInput extends CashbillDocumentRequest {
  historyMemo?: string
}
export type CancelIssuedCashbillInput = IssueCashbillInput
export type DeleteCashbillInput = CashbillDocumentRequest
export type GetCashbillInfoInput = CashbillDocumentRequest
export interface GetCashbillsInfoInput extends CashbillBusinessRequest {
  managementKeys: string[]
}
export type GetCashbillDetailInfoInput = CashbillDocumentRequest
export type CheckCashbillManagementKeyInUseInput = CashbillDocumentRequest

export interface SearchCashbillsInput extends CashbillBusinessRequest {
  searchDateType: CashbillDateType
  startDate: string
  endDate: string
  stateCodes?: string[]
  transactionTypes?: ('N' | 'C')[]
  usageTypes?: ('P' | 'C')[]
  tradeOptions?: ('N' | 'B' | 'T')[]
  taxTypes?: ('T' | 'N')[]
  merchantTaxRegistrationIdentifiers?: string[]
  queryText?: string
  sortOrder?: CashbillSortOrder
  pageNumber?: number
  pageSize?: number
}
export type GetCashbillLogsInput = CashbillDocumentRequest

export interface GetCashbillBoxURLInput extends CashbillBusinessRequest {
  cashbillBoxScope: CashbillBoxScope
}
export type GetCashbillPopupURLInput = CashbillDocumentRequest
export type GetCashbillViewURLInput = CashbillDocumentRequest
export type GetCashbillPrintURLInput = CashbillDocumentRequest
export type GetReceiverCashbillPrintURLInput = CashbillDocumentRequest
export type GetBulkCashbillPrintURLInput = GetCashbillsInfoInput
export type GetCashbillMailURLInput = CashbillDocumentRequest
export type GetCashbillPDFURLInput = CashbillDocumentRequest
export type DownloadCashbillPDFInput = CashbillDocumentRequest
export interface ResendCashbillEmailInput extends CashbillDocumentRequest {
  receiverEmailAddress: string
}
export interface ResendCashbillSMSInput extends ResendCashbillFAXInput {
  messageBody: string
}
export interface ResendCashbillFAXInput extends CashbillDocumentRequest {
  senderPhoneNumber: string
  receiverPhoneNumber: string
}
export interface AssignCashbillManagementKeyInput extends CashbillDocumentRequest {
  itemKey: string
}
export type GetCashbillEmailSendSettingsInput = CashbillBusinessRequest
export interface UpdateCashbillEmailSendSettingsInput extends CashbillBusinessRequest {
  emailTypeCode: 'CSH_ISSUE'
  sendEnabled: boolean
}
export type GetCashbillChargeInfoInput = CashbillBusinessRequest
export type GetCashbillUnitCostInput = CashbillBusinessRequest

/** 사용자 ID는 client 생성 시 지정하며, compatibility 별칭을 제공하지 않습니다. */
export interface CashbillService {
  /** Compat: `registIssue` */
  issueCashbillImmediately(input: IssueCashbillImmediatelyInput): Promise<Response.CashbillIssueResult>
  /** Compat: `revokeRegistIssue` */
  revokeCashbill(input: RevokeCashbillInput): Promise<Response.CashbillIssueResult>
  /** Compat: `bulkSubmit` */
  submitCashbills(input: SubmitCashbillsInput): Promise<Response.CashbillBulkSubmissionResult>
  /** Compat: `getBulkResult` */
  getCashbillBulkResult(input: GetCashbillBulkResultInput): Promise<Response.CashbillBulkResult>
  /** Compat: `register` */
  registerCashbill(input: RegisterCashbillInput): Promise<Response.CashbillOperationResult>
  /** Compat: `revokeRegister` */
  registerCashbillRevocation(input: RegisterCashbillRevocationInput): Promise<Response.CashbillOperationResult>
  /** Compat: `update` */
  updateCashbill(input: UpdateCashbillInput): Promise<Response.CashbillOperationResult>
  /** Compat: `issue` */
  issueCashbill(input: IssueCashbillInput): Promise<Response.CashbillIssueResult>
  /** Compat: `cancelIssue` */
  cancelIssuedCashbill(input: CancelIssuedCashbillInput): Promise<Response.CashbillOperationResult>
  /** Compat: `delete` */
  deleteCashbill(input: DeleteCashbillInput): Promise<Response.CashbillOperationResult>
  /** Compat: `getInfo` */
  getCashbillInfo(input: GetCashbillInfoInput): Promise<Response.CashbillInfo>
  /** Compat: `getInfos` */
  getCashbillsInfo(input: GetCashbillsInfoInput): Promise<Response.CashbillInfo[]>
  /** Compat: `getDetailInfo` */
  getCashbillDetailInfo(input: GetCashbillDetailInfoInput): Promise<Response.CashbillDocumentOutput>
  /** Compat: `checkMgtKeyInUse` */
  checkCashbillManagementKeyInUse(input: CheckCashbillManagementKeyInUseInput): Promise<Response.CashbillManagementKeyUsage>
  /** Compat: `search` */
  searchCashbills(input: SearchCashbillsInput): Promise<Response.CashbillSearchResult>
  /** Compat: `getLogs` */
  getCashbillLogs(input: GetCashbillLogsInput): Promise<Response.CashbillLogEntry[]>
  /** Compat: `getURL` */
  getCashbillBoxURL(input: GetCashbillBoxURLInput): Promise<Response.CashbillAccessUrl>
  /** Compat: `getPopUpURL` */
  getCashbillPopupURL(input: GetCashbillPopupURLInput): Promise<Response.CashbillAccessUrl>
  /** Compat: `getViewURL` */
  getCashbillViewURL(input: GetCashbillViewURLInput): Promise<Response.CashbillAccessUrl>
  /** Compat: `getPrintURL` */
  getCashbillPrintURL(input: GetCashbillPrintURLInput): Promise<Response.CashbillAccessUrl>
  /** Compat: `getEPrintURL` */
  getReceiverCashbillPrintURL(input: GetReceiverCashbillPrintURLInput): Promise<Response.CashbillAccessUrl>
  /** Compat: `getMassPrintURL` */
  getBulkCashbillPrintURL(input: GetBulkCashbillPrintURLInput): Promise<Response.CashbillAccessUrl>
  /** Compat: `getMailURL` */
  getCashbillMailURL(input: GetCashbillMailURLInput): Promise<Response.CashbillAccessUrl>
  /** Compat: `getPDFURL` */
  getCashbillPDFURL(input: GetCashbillPDFURLInput): Promise<Response.CashbillAccessUrl>
  /** Compat: `getPDF` */
  downloadCashbillPDF(input: DownloadCashbillPDFInput): Promise<Buffer>
  /** Compat: `sendEmail` */
  resendCashbillEmail(input: ResendCashbillEmailInput): Promise<Response.CashbillOperationResult>
  /** Compat: `sendSMS` */
  resendCashbillSMS(input: ResendCashbillSMSInput): Promise<Response.CashbillOperationResult>
  /** Compat: `sendFAX` */
  resendCashbillFAX(input: ResendCashbillFAXInput): Promise<Response.CashbillOperationResult>
  /** Compat: `assignMgtKey` */
  assignCashbillManagementKey(input: AssignCashbillManagementKeyInput): Promise<Response.CashbillOperationResult>
  /** Compat: `listEmailConfig` */
  getEmailSendSettings(input: GetCashbillEmailSendSettingsInput): Promise<Response.CashbillEmailSendSetting[]>
  /** Compat: `updateEmailConfig` */
  updateEmailSendSettings(input: UpdateCashbillEmailSendSettingsInput): Promise<Response.CashbillOperationResult>
  /** Compat: `getChargeInfo` */
  getChargeInfo(input: GetCashbillChargeInfoInput): Promise<Response.CashbillChargeInfo>
  /** Compat: `getUnitCost` */
  getUnitCost(input: GetCashbillUnitCostInput): Promise<Response.CashbillUnitCost>
}
