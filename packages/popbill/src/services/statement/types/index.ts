import type { StatementDocumentInput, StatementItemCode } from './document'
import type * as response from './response'

export * from './document'
export type * from './response'

export const StatementDateType = { Registered: 'R', Written: 'W', Issued: 'I' } as const
export type StatementDateType = (typeof StatementDateType)[keyof typeof StatementDateType]
export const StatementSortOrder = { Descending: 'D', Ascending: 'A' } as const
export type StatementSortOrder = (typeof StatementSortOrder)[keyof typeof StatementSortOrder]
/** 전자명세서 문서함입니다. SWBOX는 발행 문서함입니다. */
export const StatementBoxScopes = {
  TemporaryDocumentBox: 'TBOX',
  IssuedDocumentBox: 'SWBOX',
} as const
export type StatementBoxScope = (typeof StatementBoxScopes)[keyof typeof StatementBoxScopes]
export const StatementStateCodes = { Registered: 100, Issued: 300, Cancelled: 500 } as const
export const StatementEmailTypes = {
  Issue: 'SMT_ISSUE',
  Accept: 'SMT_ACCEPT',
  Deny: 'SMT_DENY',
  Cancel: 'SMT_CANCEL',
  CancelIssue: 'SMT_CANCEL_ISSUE',
} as const
export type StatementEmailType = (typeof StatementEmailTypes)[keyof typeof StatementEmailTypes]

export interface StatementBusinessRequest {
  businessNumber: string
}

export interface StatementTypeRequest extends StatementBusinessRequest {
  documentTypeCode: StatementItemCode
}

export interface StatementDocumentRequest extends StatementTypeRequest {
  managementKey: string
}

export interface IssueStatementImmediatelyInput extends RegisterStatementInput {
  historyMemo?: string
  emailSubject?: string
}

export interface RegisterStatementInput extends StatementBusinessRequest {
  document: StatementDocumentInput
}

export interface UpdateStatementInput extends StatementDocumentRequest {
  document: StatementDocumentInput
}

export interface IssueStatementInput extends StatementDocumentRequest {
  historyMemo?: string
  emailSubject?: string
}

export interface CancelIssuedStatementInput extends StatementDocumentRequest {
  historyMemo?: string
}

export type DeleteStatementInput = StatementDocumentRequest
export type GetStatementInfoInput = StatementDocumentRequest

export interface GetStatementsInfoInput extends StatementTypeRequest {
  managementKeys: string[]
}
export type GetStatementDetailInfoInput = StatementDocumentRequest
export type CheckStatementManagementKeyInUseInput = StatementDocumentRequest

export interface SearchStatementsInput extends StatementBusinessRequest {
  searchDateType: StatementDateType
  /** 검색일자는 yyyyMMdd 형식입니다. 조회 기간은 최대 6개월입니다. */
  startDate: string
  endDate: string
  stateCodes?: string[]
  documentTypeCodes?: StatementItemCode[]
  queryText?: string
  sortOrder?: StatementSortOrder
  /** @default 1 */
  pageNumber?: number
  /** @default 100 */
  pageSize?: number
}
export type GetStatementLogsInput = StatementDocumentRequest

export interface GetStatementBoxURLInput extends StatementBusinessRequest {
  statementBoxScope: StatementBoxScope
}

export type GetStatementPopupURLInput = StatementDocumentRequest
export type GetStatementViewURLInput = StatementDocumentRequest
export type GetSenderStatementPrintURLInput = StatementDocumentRequest
export type GetReceiverStatementPrintURLInput = StatementDocumentRequest
export type GetBulkStatementPrintURLInput = GetStatementsInfoInput
export type GetStatementMailURLInput = StatementDocumentRequest
export type GetStatementSealAndAttachmentRegistrationURLInput = StatementBusinessRequest

export interface AttachStatementFileFromPathInput extends StatementDocumentRequest {
  filePath: string
  displayName: string
}

export interface AttachStatementFileFromBinaryInput extends StatementDocumentRequest {
  fileName: string
  fileData: Buffer
}

export interface DeleteStatementAttachedFileInput extends StatementDocumentRequest {
  fileIdentifier: string
}

export type GetStatementAttachedFilesInput = StatementDocumentRequest

export interface ResendStatementEmailInput extends StatementDocumentRequest {
  receiverEmailAddress: string
}

export interface ResendStatementSMSInput extends ResendStatementFAXInput {
  /** 필수 문자 본문입니다. 90바이트를 초과하는 부분은 팝빌에서 삭제합니다. */
  messageBody: string
}

export interface ResendStatementFAXInput extends StatementDocumentRequest {
  senderPhoneNumber: string
  receiverPhoneNumber: string
}

/** 저장 없이 문서 내용을 팩스로 전송합니다. */
export interface SendStatementFAXInput extends RegisterStatementInput {
  senderPhoneNumber: string
  receiverPhoneNumber: string
}

export interface AttachStatementInput extends StatementDocumentRequest {
  attachedDocumentTypeCode: StatementItemCode
  attachedManagementKey: string
}

export type DetachStatementInput = AttachStatementInput
export type GetStatementEmailSendSettingsInput = StatementBusinessRequest

export interface UpdateStatementEmailSendSettingsInput extends StatementBusinessRequest {
  emailTypeCode: StatementEmailType
  sendEnabled: boolean
}

export type GetStatementChargeInfoInput = StatementTypeRequest
export type GetStatementUnitCostInput = StatementTypeRequest

/** 전자명세서 modern API입니다. 사용자 ID는 client 생성 시 지정합니다. */
export interface StatementService {
  /** 즉시발행합니다. Compat: `registIssue` */
  issueStatementImmediately(input: IssueStatementImmediatelyInput): Promise<response.StatementIssueResult>
  /** 임시저장합니다. Compat: `register` */
  registerStatement(input: RegisterStatementInput): Promise<response.StatementOperationResult>
  /** 임시저장 문서를 수정합니다. Compat: `update` */
  updateStatement(input: UpdateStatementInput): Promise<response.StatementOperationResult>
  /** 저장 문서를 발행합니다. Compat: `issue` */
  issueStatement(input: IssueStatementInput): Promise<response.StatementOperationResult>
  /** 발행을 취소합니다. Compat: `cancel` */
  cancelIssuedStatement(input: CancelIssuedStatementInput): Promise<response.StatementOperationResult>
  /** 문서를 삭제합니다. Compat: `delete` */
  deleteStatement(input: DeleteStatementInput): Promise<response.StatementOperationResult>
  /** 요약과 상태를 조회합니다. Compat: `getInfo` */
  getStatementInfo(input: GetStatementInfoInput): Promise<response.StatementInfo>
  /** 여러 문서의 상태를 조회합니다. Compat: `getInfos` */
  getStatementsInfo(input: GetStatementsInfoInput): Promise<response.StatementInfo[]>
  /** 문서 상세를 조회합니다. Compat: `getDetailInfo` */
  getStatementDetailInfo(input: GetStatementDetailInfoInput): Promise<response.StatementDocumentOutput>
  /** 관리번호 사용 여부를 조회합니다. Compat: `checkMgtKeyInUse` */
  checkStatementManagementKeyInUse(input: CheckStatementManagementKeyInUseInput): Promise<response.StatementManagementKeyUsage>
  /** 조건에 맞는 문서를 검색합니다. Compat: `search` */
  searchStatements(input: SearchStatementsInput): Promise<response.StatementSearchResult>
  /** 처리 이력을 조회합니다. Compat: `getLogs` */
  getStatementLogs(input: GetStatementLogsInput): Promise<response.StatementLogEntry[]>
  /** 문서함 URL을 조회합니다. Compat: `getURL` */
  getStatementBoxURL(input: GetStatementBoxURLInput): Promise<response.StatementAccessUrl>
  /** 문서 팝업 URL을 조회합니다. Compat: `getPopUpURL` */
  getStatementPopupURL(input: GetStatementPopupURLInput): Promise<response.StatementAccessUrl>
  /** 문서 보기 URL을 조회합니다. Compat: `getViewURL` */
  getStatementViewURL(input: GetStatementViewURLInput): Promise<response.StatementAccessUrl>
  /** 발신자용 인쇄 URL을 조회합니다. Compat: `getPrintURL` */
  getSenderStatementPrintURL(input: GetSenderStatementPrintURLInput): Promise<response.StatementAccessUrl>
  /** 수신자용 인쇄 URL을 조회합니다. Compat: `getEPrintURL` */
  getReceiverStatementPrintURL(input: GetReceiverStatementPrintURLInput): Promise<response.StatementAccessUrl>
  /** 여러 문서의 인쇄 URL을 조회합니다. Compat: `getMassPrintURL` */
  getBulkStatementPrintURL(input: GetBulkStatementPrintURLInput): Promise<response.StatementAccessUrl>
  /** 안내메일 링크 URL을 조회합니다. Compat: `getMailURL` */
  getStatementMailURL(input: GetStatementMailURLInput): Promise<response.StatementAccessUrl>
  /** 인감 및 첨부서류 등록 URL을 조회합니다. Compat: `getSealURL` */
  getSealAndAttachmentRegistrationURL(input: GetStatementSealAndAttachmentRegistrationURLInput): Promise<response.StatementAccessUrl>
  /** 경로의 파일을 첨부합니다. Compat: `attachFile` */
  attachFileFromPath(input: AttachStatementFileFromPathInput): Promise<response.StatementOperationResult>
  /** 바이너리 파일을 첨부합니다. Compat: `attachFileBinary` */
  attachFileFromBinary(input: AttachStatementFileFromBinaryInput): Promise<response.StatementOperationResult>
  /** 첨부파일을 삭제합니다. Compat: `deleteFile` */
  deleteAttachedFile(input: DeleteStatementAttachedFileInput): Promise<response.StatementOperationResult>
  /** 첨부파일을 조회합니다. Compat: `getFiles` */
  getAttachedFiles(input: GetStatementAttachedFilesInput): Promise<response.StatementAttachedFile[]>
  /** 안내메일을 재전송합니다. Compat: `sendEmail` */
  resendStatementEmail(input: ResendStatementEmailInput): Promise<response.StatementOperationResult>
  /** 문자를 재전송합니다. Compat: `sendSMS` */
  resendStatementSMS(input: ResendStatementSMSInput): Promise<response.StatementOperationResult>
  /** 팩스를 재전송합니다. Compat: `sendFAX` */
  resendStatementFAX(input: ResendStatementFAXInput): Promise<response.StatementOperationResult>
  /** 문서를 선팩스로 전송합니다. Compat: `FAXSend` */
  sendStatementFAX(input: SendStatementFAXInput): Promise<response.StatementFAXReceipt>
  /** 다른 전자명세서를 첨부합니다. Compat: `attachStatement` */
  attachStatement(input: AttachStatementInput): Promise<response.StatementOperationResult>
  /** 전자명세서 첨부를 해제합니다. Compat: `detachStatement` */
  detachStatement(input: DetachStatementInput): Promise<response.StatementOperationResult>
  /** 이메일 전송 설정을 조회합니다. Compat: `listEmailConfig` */
  getEmailSendSettings(input: GetStatementEmailSendSettingsInput): Promise<response.StatementEmailSendSetting[]>
  /** 이메일 전송 설정을 수정합니다. Compat: `updateEmailConfig` */
  updateEmailSendSettings(input: UpdateStatementEmailSendSettingsInput): Promise<response.StatementOperationResult>
  /** 과금 정보를 조회합니다. Compat: `getChargeInfo` */
  getChargeInfo(input: GetStatementChargeInfoInput): Promise<response.StatementChargeInfo>
  /** 발행 단가를 조회합니다. Compat: `getUnitCost` */
  getUnitCost(input: GetStatementUnitCostInput): Promise<response.StatementUnitCost>
}
