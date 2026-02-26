import type { TaxInvoiceDateString, TaxInvoiceDateType } from '@connextable/popbill-spec'
import {
  TaxInvoiceModificationReasonCodes,
  type TaxInvoiceDocumentInput,
  type TaxInvoiceModificationReasonCode,
} from './document'
import type {
  TaxInvoiceAccessUrl,
  TaxInvoiceAttachedFile,
  TaxInvoiceBulkIssueSubmissionResult,
  TaxInvoiceBulkSubmitResult,
  TaxInvoiceDocumentOutput,
  TaxInvoiceEmailSendSetting,
  TaxInvoiceInfo,
  TaxInvoiceInvoiceManagementKeyUsage,
  TaxInvoiceIssueResult,
  TaxInvoiceLogEntry,
  TaxInvoiceOperationResult,
  TaxInvoiceSearchResult,
  TaxInvoiceSendToNationalTaxServiceSetting,
  TaxInvoiceTaxCertificateExpiration,
  TaxInvoiceTaxCertificateInfo,
  TaxInvoiceXmlResult,
} from './response'
export {
  TaxInvoiceBusinessStatusValues,
  TaxInvoiceChargeDirectionValues,
  TaxInvoiceIssueTypes,
  TaxInvoiceModificationReasonCodes,
  TaxInvoicePurposeTypes,
  TaxInvoiceRecipientTypes,
  TaxInvoiceTaxationTypes,
} from './document'
export type {
  TaxInvoiceAdditionalContactInput,
  TaxInvoiceBusinessStatus,
  TaxInvoiceChargeDirection,
  TaxInvoiceDocumentInput,
  TaxInvoiceIssueType,
  TaxInvoiceLineItemInput,
  TaxInvoiceModificationReasonCode,
  TaxInvoicePartyInput,
  TaxInvoicePurposeType,
  TaxInvoiceRecipientType,
  TaxInvoiceTaxationType,
  TaxInvoiceBuyerInput,
} from './document'
export type {
  TaxInvoiceAccessUrl,
  TaxInvoiceAttachedFile,
  TaxInvoiceBulkIssueSubmissionResult,
  TaxInvoiceBulkIssueSubmissionResultItem,
  TaxInvoiceBulkIssueSubmissionTransactionState,
  TaxInvoiceBulkSubmitResult,
  TaxInvoiceDocumentOutput,
  TaxInvoiceEmailSendSetting,
  TaxInvoiceInfo,
  TaxInvoiceInvoiceManagementKeyUsage,
  TaxInvoiceIssueResult,
  TaxInvoiceLogEntry,
  TaxInvoiceOperationResult,
  TaxInvoiceSearchResult,
  TaxInvoiceSendToNationalTaxServiceSetting,
  TaxInvoiceTaxCertificateExpiration,
  TaxInvoiceTaxCertificateInfo,
  TaxInvoiceXmlResult,
} from './response'
export { TaxInvoiceBulkIssueSubmissionTransactionStates } from './response'

/**
 * 세금계산서 문서번호 유형 상수입니다.
 */
export const TaxInvoiceDocumentKeyTypes = {
  /** 코드: `SELL`, 설명: 매출 문서번호 유형 */
  Sales: 'SELL',
  /** 코드: `BUY`, 설명: 매입 문서번호 유형 */
  Purchase: 'BUY',
  /** 코드: `TRUSTEE`, 설명: 위수탁 문서번호 유형 */
  Trustee: 'TRUSTEE',
} as const

/**
 * 세금계산서 문서번호 유형입니다.
 */
export type TaxInvoiceDocumentKeyType = (typeof TaxInvoiceDocumentKeyTypes)[keyof typeof TaxInvoiceDocumentKeyTypes]

/**
 * 세금계산서 문서함 범위 상수입니다.
 */
export const TaxInvoiceBoxScopes = {
  /** 코드: `TBOX`, 설명: 임시 문서함 */
  TemporaryDocumentBox: 'TBOX',
  /** 코드: `SWBOX`, 설명: 매출 발행 대기함 */
  SalesIssueWaitingBox: 'SWBOX',
  /** 코드: `SBOX`, 설명: 매출 문서함 */
  SalesDocumentBox: 'SBOX',
  /** 코드: `PWBOX`, 설명: 매입 발행 대기함 */
  PurchaseIssueWaitingBox: 'PWBOX',
  /** 코드: `PBOX`, 설명: 매입 문서함 */
  PurchaseDocumentBox: 'PBOX',
  /** 코드: `WRITE`, 설명: 정발행 작성 */
  WriteInvoice: 'WRITE',
} as const

/**
 * 세금계산서 문서함 범위 값입니다.
 */
export type TaxInvoiceBoxScope = (typeof TaxInvoiceBoxScopes)[keyof typeof TaxInvoiceBoxScopes]

/**
 * 검색 조건의 휴폐업 상태 상수입니다.
 */
export const TaxInvoiceCloseDownStateCodes = {
  /** 코드: `0`, 설명: 미등록 */
  NotRegistered: '0',
  /** 코드: `1`, 설명: 사업중 */
  Operating: '1',
  /** 코드: `2`, 설명: 폐업 */
  Closed: '2',
  /** 코드: `3`, 설명: 휴업 */
  Suspended: '3',
  /** 코드: `4`, 설명: 확인실패 */
  CheckFailed: '4',
} as const

/**
 * 검색 조건의 휴폐업 상태 코드입니다.
 */
export type TaxInvoiceCloseDownStateCode =
  (typeof TaxInvoiceCloseDownStateCodes)[keyof typeof TaxInvoiceCloseDownStateCodes]

/**
 * 수정세금계산서 사유코드입니다.
 */
export const TaxInvoiceModificationCodes = TaxInvoiceModificationReasonCodes

/**
 * 수정세금계산서 사유코드입니다.
 */
export type TaxInvoiceModificationCode = TaxInvoiceModificationReasonCode

/**
 * 사업자번호 입력이 필요한 요청의 공통 필드입니다.
 */
export interface TaxInvoiceBusinessRequest {
  /**
   * 팝빌 회원 사업자번호입니다.
   */
  businessNumber: string
}

/**
 * 문서 식별(문서번호 유형 + 문서번호)이 필요한 요청의 공통 필드입니다.
 */
export interface TaxInvoiceDocumentRequest extends TaxInvoiceBusinessRequest {
  /**
   * 문서번호 유형입니다.
   */
  invoiceDocumentKeyType: TaxInvoiceDocumentKeyType
  /**
   * 파트너가 관리하는 문서번호입니다.
   */
  invoiceManagementKey: string
}

/**
 * 즉시 발행 요청 입력입니다.
 */
export interface IssueInvoiceImmediatelyInput extends TaxInvoiceBusinessRequest {
  /** 발행할 세금계산서 문서 원본입니다. */
  taxInvoiceDocument: TaxInvoiceDocumentInput
  /** 거래명세서 동시작성 여부입니다. */
  writeSpecification?: boolean
  /** 지연발행 허용 여부입니다. */
  forceIssue?: boolean
  /** 상태 이력에 남길 메모입니다. */
  historyMemo?: string
  /** 발행 안내 메일 제목입니다. */
  emailSubject?: string
  /** 거래명세서 관리번호입니다. */
  dealInvoiceManagementKey?: string
}

/**
 * 초대량 발행 접수 요청 입력입니다.
 */
export interface SubmitBulkIssueInput extends TaxInvoiceBusinessRequest {
  /** 초대량 접수 식별자(SubmitID)입니다. */
  submissionIdentifier: string
  /** 접수할 세금계산서 문서 목록입니다. */
  taxInvoiceDocuments: TaxInvoiceDocumentInput[]
  /** 지연발행 허용 여부입니다. */
  forceIssue?: boolean
}

/**
 * 초대량 접수결과 조회 요청 입력입니다.
 */
export interface GetBulkIssueSubmissionResultInput extends TaxInvoiceBusinessRequest {
  /** 조회할 초대량 접수 식별자(SubmitID)입니다. */
  submissionIdentifier: string
}

/**
 * 임시저장 요청 입력입니다.
 */
export interface RegisterInvoiceInput extends TaxInvoiceBusinessRequest {
  /** 임시저장할 세금계산서 문서 원본입니다. */
  taxInvoiceDocument: TaxInvoiceDocumentInput
}

/**
 * 문서 수정 요청 입력입니다.
 */
export interface UpdateInvoiceInput extends TaxInvoiceDocumentRequest {
  /** 수정할 세금계산서 문서 원본입니다. */
  taxInvoiceDocument: TaxInvoiceDocumentInput
}

/**
 * 저장된 문서 발행 요청 입력입니다.
 */
export interface IssueInvoiceInput extends TaxInvoiceDocumentRequest {
  /** 상태 이력에 남길 메모입니다. */
  historyMemo: string
  /** 발행 안내 메일 제목입니다. */
  emailSubject?: string
  /** 지연발행 허용 여부입니다. */
  forceIssue?: boolean
}

/**
 * 발행취소 요청 입력입니다.
 */
export interface CancelIssuedInvoiceInput extends TaxInvoiceDocumentRequest {
  /** 상태 이력에 남길 메모입니다. */
  historyMemo: string
}

/**
 * 역발행 즉시 요청 입력입니다.
 */
export interface RequestReverseIssueImmediatelyInput extends TaxInvoiceBusinessRequest {
  /** 역발행 요청할 세금계산서 문서 원본입니다. */
  taxInvoiceDocument: TaxInvoiceDocumentInput
  /** 상태 이력에 남길 메모입니다. */
  historyMemo: string
}

/**
 * 역발행 요청 입력입니다.
 */
export interface RequestReverseIssueInput extends TaxInvoiceDocumentRequest {
  /** 상태 이력에 남길 메모입니다. */
  historyMemo: string
}

/**
 * 역발행 요청취소 입력입니다.
 */
export interface CancelReverseIssueRequestInput extends TaxInvoiceDocumentRequest {
  /** 상태 이력에 남길 메모입니다. */
  historyMemo: string
}

/**
 * 역발행 요청거부 입력입니다.
 */
export interface RefuseReverseIssueRequestInput extends TaxInvoiceDocumentRequest {
  /** 상태 이력에 남길 메모입니다. */
  historyMemo: string
}

/**
 * 다건 상태 조회 요청 입력입니다.
 */
export interface GetInvoicesInfoInput extends TaxInvoiceBusinessRequest {
  /** 조회 대상 문서번호 유형입니다. */
  invoiceDocumentKeyType: TaxInvoiceDocumentKeyType
  /** 조회 대상 문서번호 목록입니다. */
  invoiceManagementKeys: string[]
}

/**
 * 검색 요청 입력입니다.
 */
export interface SearchInvoicesInput extends TaxInvoiceBusinessRequest {
  /** 조회 대상 문서번호 유형입니다. */
  invoiceDocumentKeyType: TaxInvoiceDocumentKeyType
  /** 검색 기준 일자 유형입니다. */
  searchDateType: TaxInvoiceDateType
  /** 검색 시작일자(yyyyMMdd)입니다. */
  startDate: TaxInvoiceDateString
  /** 검색 종료일자(yyyyMMdd)입니다. */
  endDate: TaxInvoiceDateString
  /** 세금계산서 상태코드 필터입니다. */
  invoiceStateCodes: string[]
  /** 문서 유형 필터입니다. */
  invoiceTypeCodes: string[]
  /** 과세형태 필터입니다. */
  taxationTypeCodes: string[]
  /** 지연발행 문서만 조회할지 여부입니다. */
  lateIssueOnly: boolean | null
  /** 정렬 방향입니다. */
  sortOrder: string
  /** 조회할 페이지 번호입니다. */
  pageNumber: number
  /** 페이지당 조회 건수입니다. */
  pageSize: number
  /** 종사업장번호 주체 필터입니다. */
  taxRegistrationIdentifierType?: string
  /** 종사업장번호 존재 여부 필터입니다. */
  taxRegistrationIdentifierAvailability?: string
  /** 종사업장번호 필터입니다. */
  taxRegistrationIdentifier?: string
  /** 검색어(상호/사업자번호/문서번호 등)입니다. */
  queryText?: string
  /** 작성유형(연동/API) 필터입니다. */
  interoperabilityType?: string
  /** 발행형태 필터입니다. */
  issueTypeCodes?: string[]
  /** 등록유형 필터입니다. */
  registrationTypeCodes?: string[]
  /** 휴폐업상태 필터입니다. */
  closeDownStateCodes?: TaxInvoiceCloseDownStateCode[]
  /** 문서번호 또는 국세청승인번호 필터입니다. */
  invoiceManagementKeyOrNationalTaxServiceConfirmationNumber?: string
}

/**
 * 문서함 URL 조회 요청 입력입니다.
 */
export interface GetTaxInvoiceBoxURLInput extends TaxInvoiceBusinessRequest {
  /** 조회할 세금계산서 문서함 범위입니다. */
  taxInvoiceBoxScope: TaxInvoiceBoxScope
}

/**
 * 다건 인쇄 URL 요청 입력입니다.
 */
export interface GetBulkInvoicePrintURLInput extends TaxInvoiceBusinessRequest {
  /** 인쇄 대상 문서번호 유형입니다. */
  invoiceDocumentKeyType: TaxInvoiceDocumentKeyType
  /** 인쇄 대상 문서번호 목록입니다. */
  invoiceManagementKeys: string[]
}

/**
 * 인감 및 첨부문서 등록 URL 조회 요청 입력입니다.
 */
export type GetSealAndAttachmentRegistrationURLInput = TaxInvoiceBusinessRequest

/**
 * 파일 경로 기반 첨부 요청 입력입니다.
 */
export interface AttachFileFromPathInput extends TaxInvoiceDocumentRequest {
  /** 팝빌에 표시할 첨부파일명입니다. */
  displayName: string
  /** 업로드할 파일의 로컬 경로입니다. */
  filePath: string
}

/**
 * 바이너리 기반 첨부 요청 입력입니다.
 */
export interface AttachFileFromBinaryInput extends TaxInvoiceDocumentRequest {
  /** 업로드할 파일명입니다. */
  fileName: string
  /** 업로드할 파일 바이너리 데이터입니다. */
  fileData: Buffer
}

/**
 * 첨부파일 삭제 요청 입력입니다.
 */
export interface DeleteAttachedFileInput extends TaxInvoiceDocumentRequest {
  /** 삭제할 첨부파일 식별자(FileID)입니다. */
  fileIdentifier: string
}

/**
 * 이메일 재전송 요청 입력입니다.
 */
export interface ResendInvoiceEmailInput extends TaxInvoiceDocumentRequest {
  /** 재전송할 수신자 이메일 주소입니다. */
  receiverEmailAddress: string
}

/**
 * 문자 재전송 요청 입력입니다.
 */
export interface ResendInvoiceSMSInput extends TaxInvoiceDocumentRequest {
  /** 발신자 전화번호입니다. */
  senderPhoneNumber: string
  /** 수신자 전화번호입니다. */
  receiverPhoneNumber: string
  /** 재전송할 문자 본문입니다. */
  messageBody: string
}

/**
 * 팩스 재전송 요청 입력입니다.
 */
export interface ResendInvoiceFAXInput extends TaxInvoiceDocumentRequest {
  /** 발신 팩스번호입니다. */
  senderNumber: string
  /** 수신 팩스번호입니다. */
  receiverNumber: string
}

/**
 * 전자명세서 첨부 요청 입력입니다.
 */
export interface AttachInvoiceStatementInput extends TaxInvoiceDocumentRequest {
  /** 첨부할 전자명세서 문서 유형 코드입니다. */
  statementItemCode: number
  /** 첨부할 전자명세서 관리번호입니다. */
  statementManagementKey: string
}

/**
 * 전자명세서 첨부해제 요청 입력입니다.
 */
export interface DetachInvoiceStatementInput extends TaxInvoiceDocumentRequest {
  /** 첨부해제할 전자명세서 문서 유형 코드입니다. */
  statementItemCode: number
  /** 첨부해제할 전자명세서 관리번호입니다. */
  statementManagementKey: string
}

/**
 * 문서번호 할당 요청 입력입니다.
 */
export interface AssignInvoiceManagementKeyInput extends TaxInvoiceBusinessRequest {
  /** 할당 대상 문서번호 유형입니다. */
  invoiceDocumentKeyType: TaxInvoiceDocumentKeyType
  /** 팝빌 문서 식별키(ItemKey)입니다. */
  itemKey: string
  /** 새로 할당할 문서번호입니다. */
  invoiceManagementKey: string
}

/**
 * 이메일 전송설정 수정 입력입니다.
 */
export interface UpdateEmailSendSettingsInput extends TaxInvoiceBusinessRequest {
  /** 수정할 메일 전송 유형 코드입니다. */
  emailType: string
  /** 전송 활성화 여부입니다. */
  sendEnabled: boolean
}

/**
 * TaxInvoice modern facade 서비스 인터페이스입니다.
 *
 * 모든 메서드는 `input`만 받으며,
 * 실패 시 `PopbillApiError`를 throw 합니다.
 */
export interface TaxInvoiceService {
  /**
   * 등록과 동시에 세금계산서를 즉시 발행합니다.
   *
   * Compat: `registIssue`
   */
  issueInvoiceImmediately(input: IssueInvoiceImmediatelyInput): Promise<TaxInvoiceIssueResult>

  /**
   * 초대량 발행을 접수합니다.
   *
   * Compat: `bulkSubmit`
   */
  submitBulkIssue(input: SubmitBulkIssueInput): Promise<TaxInvoiceBulkSubmitResult>

  /**
   * 초대량 발행 접수결과를 조회합니다.
   *
   * Compat: `getBulkResult`
   */
  getBulkIssueSubmissionResult(input: GetBulkIssueSubmissionResultInput): Promise<TaxInvoiceBulkIssueSubmissionResult>

  /**
   * 세금계산서를 임시저장합니다.
   *
   * Compat: `register`
   */
  registerInvoice(input: RegisterInvoiceInput): Promise<TaxInvoiceOperationResult>

  /**
   * 임시저장 문서를 수정합니다.
   *
   * Compat: `update`
   */
  updateInvoice(input: UpdateInvoiceInput): Promise<TaxInvoiceOperationResult>

  /**
   * 저장된 문서를 발행합니다.
   *
   * Compat: `issue`
   */
  issueInvoice(input: IssueInvoiceInput): Promise<TaxInvoiceIssueResult>

  /**
   * 발행된 문서를 취소합니다.
   *
   * Compat: `cancelIssue`
   */
  cancelIssuedInvoice(input: CancelIssuedInvoiceInput): Promise<TaxInvoiceOperationResult>

  /**
   * 등록과 동시에 역발행 요청을 보냅니다.
   *
   * Compat: `registRequest`
   */
  requestReverseIssueImmediately(input: RequestReverseIssueImmediatelyInput): Promise<TaxInvoiceOperationResult>

  /**
   * 저장된 문서로 역발행 요청을 보냅니다.
   *
   * Compat: `request`
   */
  requestReverseIssue(input: RequestReverseIssueInput): Promise<TaxInvoiceOperationResult>

  /**
   * 역발행 요청을 취소합니다.
   *
   * Compat: `cancelRequest`
   */
  cancelReverseIssueRequest(input: CancelReverseIssueRequestInput): Promise<TaxInvoiceOperationResult>

  /**
   * 역발행 요청을 거부합니다.
   *
   * Compat: `refuse`
   */
  refuseReverseIssueRequest(input: RefuseReverseIssueRequestInput): Promise<TaxInvoiceOperationResult>

  /**
   * 문서를 삭제합니다.
   *
   * Compat: `delete`
   */
  deleteInvoice(input: TaxInvoiceDocumentRequest): Promise<TaxInvoiceOperationResult>

  /**
   * 문서를 국세청으로 즉시 전송합니다.
   *
   * Compat: `sendToNTS`
   */
  sendInvoiceToNTS(input: TaxInvoiceDocumentRequest): Promise<TaxInvoiceOperationResult>

  /**
   * 문서 1건의 상태 요약정보를 조회합니다.
   *
   * Compat: `getInfo`
   */
  getInvoiceInfo(input: TaxInvoiceDocumentRequest): Promise<TaxInvoiceInfo>

  /**
   * 문서 다건의 상태 요약정보를 조회합니다.
   *
   * Compat: `getInfos`
   */
  getInvoicesInfo(input: GetInvoicesInfoInput): Promise<TaxInvoiceInfo[]>

  /**
   * 문서 1건의 상세정보를 조회합니다.
   *
   * Compat: `getDetailInfo`
   */
  getInvoiceDetailInfo(input: TaxInvoiceDocumentRequest): Promise<TaxInvoiceDocumentOutput>

  /**
   * 문서번호 사용 여부를 확인합니다.
   *
   * Compat: `checkMgtKeyInUse`
   */
  checkInvoiceManagementKeyInUse(input: TaxInvoiceDocumentRequest): Promise<TaxInvoiceInvoiceManagementKeyUsage>

  /**
   * 문서 XML 정보를 조회합니다.
   *
   * Compat: `getXML`
   */
  getInvoiceXML(input: TaxInvoiceDocumentRequest): Promise<TaxInvoiceXmlResult>

  /**
   * 검색조건으로 문서를 조회합니다.
   *
   * Compat: `search`
   */
  searchInvoices(input: SearchInvoicesInput): Promise<TaxInvoiceSearchResult>

  /**
   * 문서 상태 변경이력을 조회합니다.
   *
   * Compat: `getLogs`
   */
  getInvoiceLogs(input: TaxInvoiceDocumentRequest): Promise<TaxInvoiceLogEntry[]>

  /**
   * 세금계산서 문서함 팝업 URL을 조회합니다.
   *
   * Compat: `getURL`
   */
  getTaxInvoiceBoxURL(input: GetTaxInvoiceBoxURLInput): Promise<TaxInvoiceAccessUrl>

  /**
   * 문서 팝업 URL을 조회합니다.
   *
   * Compat: `getPopUpURL`
   */
  getInvoicePopupURL(input: TaxInvoiceDocumentRequest): Promise<TaxInvoiceAccessUrl>

  /**
   * 보기 전용 팝업 URL을 조회합니다.
   *
   * Compat: `getViewURL`
   */
  getInvoiceViewURL(input: TaxInvoiceDocumentRequest): Promise<TaxInvoiceAccessUrl>

  /**
   * 공급자 인쇄 팝업 URL을 조회합니다.
   *
   * Compat: `getPrintURL`
   */
  getSupplierInvoicePrintURL(input: TaxInvoiceDocumentRequest): Promise<TaxInvoiceAccessUrl>

  /**
   * 공급받는자 인쇄 팝업 URL을 조회합니다.
   *
   * Compat: `getEPrintURL`
   */
  getBuyerInvoicePrintURL(input: TaxInvoiceDocumentRequest): Promise<TaxInvoiceAccessUrl>

  /**
   * 다건 인쇄 팝업 URL을 조회합니다.
   *
   * Compat: `getMassPrintURL`
   */
  getBulkInvoicePrintURL(input: GetBulkInvoicePrintURLInput): Promise<TaxInvoiceAccessUrl>

  /**
   * 메일 보기 URL을 조회합니다.
   *
   * Compat: `getMailURL`
   */
  getInvoiceMailURL(input: TaxInvoiceDocumentRequest): Promise<TaxInvoiceAccessUrl>

  /**
   * PDF 다운로드 URL을 조회합니다.
   *
   * Compat: `getPDFURL`
   */
  getInvoicePDFURL(input: TaxInvoiceDocumentRequest): Promise<TaxInvoiceAccessUrl>

  /**
   * 인감 및 첨부문서 등록 URL을 조회합니다.
   *
   * Compat: `getSealURL`
   */
  getSealAndAttachmentRegistrationURL(input: GetSealAndAttachmentRegistrationURLInput): Promise<TaxInvoiceAccessUrl>

  /**
   * 파일 경로 기반 첨부를 수행합니다.
   *
   * Compat: `attachFile`
   */
  attachFileFromPath(input: AttachFileFromPathInput): Promise<TaxInvoiceOperationResult>

  /**
   * 바이너리 기반 첨부를 수행합니다.
   *
   * Compat: `attachFileBinary`
   */
  attachFileFromBinary(input: AttachFileFromBinaryInput): Promise<TaxInvoiceOperationResult>

  /**
   * 첨부파일을 삭제합니다.
   *
   * Compat: `deleteFile`
   */
  deleteAttachedFile(input: DeleteAttachedFileInput): Promise<TaxInvoiceOperationResult>

  /**
   * 첨부파일 목록을 조회합니다.
   *
   * Compat: `getFiles`
   */
  getAttachedFiles(input: TaxInvoiceDocumentRequest): Promise<TaxInvoiceAttachedFile[]>

  /**
   * 안내 메일을 재전송합니다.
   *
   * Compat: `sendEmail`
   */
  resendInvoiceEmail(input: ResendInvoiceEmailInput): Promise<TaxInvoiceOperationResult>

  /**
   * 안내 문자를 재전송합니다.
   *
   * Compat: `sendSMS`
   */
  resendInvoiceSMS(input: ResendInvoiceSMSInput): Promise<TaxInvoiceOperationResult>

  /**
   * 안내 팩스를 재전송합니다.
   *
   * Compat: `sendFAX`
   */
  resendInvoiceFAX(input: ResendInvoiceFAXInput): Promise<TaxInvoiceOperationResult>

  /**
   * 전자명세서를 첨부합니다.
   *
   * Compat: `attachStatement`
   */
  attachInvoiceStatement(input: AttachInvoiceStatementInput): Promise<TaxInvoiceOperationResult>

  /**
   * 전자명세서 첨부를 해제합니다.
   *
   * Compat: `detachStatement`
   */
  detachInvoiceStatement(input: DetachInvoiceStatementInput): Promise<TaxInvoiceOperationResult>

  /**
   * 문서번호를 할당합니다.
   *
   * Compat: `assignMgtKey`
   */
  assignInvoiceManagementKey(input: AssignInvoiceManagementKeyInput): Promise<TaxInvoiceOperationResult>

  /**
   * 이메일 발송설정을 조회합니다.
   *
   * Compat: `listEmailConfig`
   */
  getEmailSendSettings(input: TaxInvoiceBusinessRequest): Promise<TaxInvoiceEmailSendSetting[]>

  /**
   * 이메일 발송설정을 수정합니다.
   *
   * Compat: `updateEmailConfig`
   */
  updateEmailSendSettings(input: UpdateEmailSendSettingsInput): Promise<TaxInvoiceOperationResult>

  /**
   * 국세청 전송설정을 조회합니다.
   *
   * Compat: `getSendToNTSConfig`
   */
  getSendToNTSSettings(input: TaxInvoiceBusinessRequest): Promise<TaxInvoiceSendToNationalTaxServiceSetting>

  /**
   * 인증서 등록 URL을 조회합니다.
   *
   * Compat: `getTaxCertURL`
   */
  getTaxCertificateRegistrationURL(input: TaxInvoiceBusinessRequest): Promise<TaxInvoiceAccessUrl>

  /**
   * 인증서 만료일을 조회합니다.
   *
   * Compat: `getCertificateExpireDate`
   */
  getTaxCertificateExpirationDate(input: TaxInvoiceBusinessRequest): Promise<TaxInvoiceTaxCertificateExpiration>

  /**
   * 인증서 유효성을 점검합니다.
   *
   * Compat: `checkCertValidation`
   */
  checkTaxCertificateValidation(input: TaxInvoiceBusinessRequest): Promise<TaxInvoiceOperationResult>

  /**
   * 인증서 정보를 조회합니다.
   *
   * Compat: `getTaxCertInfo`
   */
  getTaxCertificateInfo(input: TaxInvoiceBusinessRequest): Promise<TaxInvoiceTaxCertificateInfo>
}
