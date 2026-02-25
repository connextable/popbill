import type {
  CloseDownState,
  IssueType,
  PurposeType,
  TaxInvoiceApiModel,
  TaxInvoiceApiResponseBase,
  TaxInvoiceBulkSubmitApiResponse,
  TaxInvoiceDateString,
  TaxInvoiceDateType,
  TaxInvoiceGetBulkResultApiResponse,
  TaxInvoiceGetDetailInfoApiResponse,
  TaxInvoiceGetFilesApiResponse,
  TaxInvoiceGetInfosApiResponse,
  TaxInvoiceGetLogsApiResponse,
  TaxInvoiceGetSealUrlApiResponse,
  TaxInvoiceGetSendToNTSConfigApiResponse,
  TaxInvoiceGetTaxCertInfoApiResponse,
  TaxInvoiceGetTaxCertUrlApiResponse,
  TaxInvoiceGetXmlApiResponse,
  TaxInvoiceIssueApiResponse,
  TaxInvoiceListEmailConfigApiResponse,
  TaxInvoiceMgtKeyType as TaxInvoiceDocumentKeyTypeRaw,
  TaxInvoiceRegistIssueApiResponse,
  TaxInvoiceSearchApiResponse,
  TaxInvoiceSearchCloseDownState as TaxInvoiceCloseDownStateCodeRaw,
  TaxType,
  TaxInvoiceGetUrlTogo as TaxInvoiceBoxScopeRaw,
} from '@connextable/popbill-spec'

/**
 * 세금계산서 문서번호 유형입니다.
 */
export type TaxInvoiceDocumentKeyType = TaxInvoiceDocumentKeyTypeRaw

/**
 * 세금계산서 문서함 범위 값입니다.
 */
export type TaxInvoiceBoxScope = TaxInvoiceBoxScopeRaw

/**
 * 검색 조건의 휴폐업 상태 코드입니다.
 */
export type TaxInvoiceCloseDownStateCode = TaxInvoiceCloseDownStateCodeRaw

/**
 * TaxInvoice API 호출 시 공통으로 사용하는 요청 옵션입니다.
 */
export interface TaxInvoiceRequestOptions {
  /**
   * 개별 요청에 사용할 팝빌 회원 아이디입니다.
   */
  userId?: string
}

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
  taxInvoiceDocument: TaxInvoiceApiModel
  writeSpecification?: boolean
  forceIssue?: boolean
  historyMemo?: string
  emailSubject?: string
  dealInvoiceManagementKey?: string
}

/**
 * 초대량 발행 접수 요청 입력입니다.
 */
export interface SubmitBulkIssueInput extends TaxInvoiceBusinessRequest {
  submissionIdentifier: string
  taxInvoiceDocuments: TaxInvoiceApiModel[]
  forceIssue?: boolean
}

/**
 * 초대량 접수결과 조회 요청 입력입니다.
 */
export interface GetBulkIssueSubmissionResultInput extends TaxInvoiceBusinessRequest {
  submissionIdentifier: string
}

/**
 * 임시저장 요청 입력입니다.
 */
export interface RegisterInvoiceInput extends TaxInvoiceBusinessRequest {
  taxInvoiceDocument: TaxInvoiceApiModel
}

/**
 * 문서 수정 요청 입력입니다.
 */
export interface UpdateInvoiceInput extends TaxInvoiceDocumentRequest {
  taxInvoiceDocument: TaxInvoiceApiModel
}

/**
 * 저장된 문서 발행 요청 입력입니다.
 */
export interface IssueInvoiceInput extends TaxInvoiceDocumentRequest {
  historyMemo: string
  emailSubject?: string
  forceIssue?: boolean
}

/**
 * 발행취소 요청 입력입니다.
 */
export interface CancelIssuedInvoiceInput extends TaxInvoiceDocumentRequest {
  historyMemo: string
}

/**
 * 역발행 즉시 요청 입력입니다.
 */
export interface RequestReverseIssueImmediatelyInput extends TaxInvoiceBusinessRequest {
  taxInvoiceDocument: TaxInvoiceApiModel
  historyMemo: string
}

/**
 * 역발행 요청 입력입니다.
 */
export interface RequestReverseIssueInput extends TaxInvoiceDocumentRequest {
  historyMemo: string
}

/**
 * 역발행 요청취소 입력입니다.
 */
export interface CancelReverseIssueRequestInput extends TaxInvoiceDocumentRequest {
  historyMemo: string
}

/**
 * 역발행 요청거부 입력입니다.
 */
export interface RefuseReverseIssueRequestInput extends TaxInvoiceDocumentRequest {
  historyMemo: string
}

/**
 * 다건 상태 조회 요청 입력입니다.
 */
export interface GetInvoicesInfoInput extends TaxInvoiceBusinessRequest {
  invoiceDocumentKeyType: TaxInvoiceDocumentKeyType
  invoiceManagementKeys: string[]
}

/**
 * 검색 요청 입력입니다.
 */
export interface SearchInvoicesInput extends TaxInvoiceBusinessRequest {
  invoiceDocumentKeyType: TaxInvoiceDocumentKeyType
  searchDateType: TaxInvoiceDateType
  startDate: TaxInvoiceDateString
  endDate: TaxInvoiceDateString
  invoiceStateCodes: string[]
  invoiceTypeCodes: string[]
  taxationTypeCodes: string[]
  lateIssueOnly: boolean | null
  sortOrder: 'A' | 'D' | string
  pageNumber: number
  pageSize: number
  taxRegistrationIdentifierType?: string
  taxRegistrationIdentifierAvailability?: string
  taxRegistrationIdentifier?: string
  queryText?: string
  interoperabilityType?: string
  issueTypeCodes?: string[]
  registrationTypeCodes?: string[]
  closeDownStateCodes?: TaxInvoiceCloseDownStateCode[]
  invoiceManagementKeyOrNationalTaxServiceConfirmationNumber?: string
}

/**
 * 문서함 URL 조회 요청 입력입니다.
 */
export interface GetTaxInvoiceBoxURLInput extends TaxInvoiceBusinessRequest {
  taxInvoiceBoxScope: TaxInvoiceBoxScope
}

/**
 * 다건 인쇄 URL 요청 입력입니다.
 */
export interface GetBulkInvoicePrintURLInput extends TaxInvoiceBusinessRequest {
  invoiceDocumentKeyType: TaxInvoiceDocumentKeyType
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
  displayName: string
  filePath: string
}

/**
 * 바이너리 기반 첨부 요청 입력입니다.
 */
export interface AttachFileFromBinaryInput extends TaxInvoiceDocumentRequest {
  fileName: string
  fileData: Buffer
}

/**
 * 첨부파일 삭제 요청 입력입니다.
 */
export interface DeleteAttachedFileInput extends TaxInvoiceDocumentRequest {
  fileIdentifier: string
}

/**
 * 이메일 재전송 요청 입력입니다.
 */
export interface ResendInvoiceEmailInput extends TaxInvoiceDocumentRequest {
  receiverEmailAddress: string
}

/**
 * 문자 재전송 요청 입력입니다.
 */
export interface ResendInvoiceSMSInput extends TaxInvoiceDocumentRequest {
  senderPhoneNumber: string
  receiverPhoneNumber: string
  messageBody: string
}

/**
 * 팩스 재전송 요청 입력입니다.
 */
export interface ResendInvoiceFAXInput extends TaxInvoiceDocumentRequest {
  senderNumber: string
  receiverNumber: string
}

/**
 * 전자명세서 첨부 요청 입력입니다.
 */
export interface AttachInvoiceStatementInput extends TaxInvoiceDocumentRequest {
  statementItemCode: number
  statementManagementKey: string
}

/**
 * 전자명세서 첨부해제 요청 입력입니다.
 */
export interface DetachInvoiceStatementInput extends TaxInvoiceDocumentRequest {
  statementItemCode: number
  statementManagementKey: string
}

/**
 * 문서번호 할당 요청 입력입니다.
 */
export interface AssignInvoiceManagementKeyInput extends TaxInvoiceBusinessRequest {
  invoiceDocumentKeyType: TaxInvoiceDocumentKeyType
  itemKey: string
  invoiceManagementKey: string
}

/**
 * 이메일 전송설정 수정 입력입니다.
 */
export interface UpdateEmailSendSettingsInput extends TaxInvoiceBusinessRequest {
  emailType: string
  sendEnabled: boolean
}

/**
 * 문서 요약정보 조회 결과입니다.
 */
export interface TaxInvoiceInfo {
  itemKey: string
  taxType: TaxType
  writtenDate: string
  registeredAt: string
  issueType: IssueType
  totalSupplyCost: string
  totalTax: string
  purposeType: PurposeType
  issuedAt: string
  isLateIssued: boolean
  isOpen: boolean
  openedAt?: string
  stateMemo: string
  stateCode: number
  stateChangedAt: string
  nationalTaxServiceConfirmationNumber?: string
  nationalTaxServiceResult?: string
  nationalTaxServiceSentAt?: string
  nationalTaxServiceResultReceivedAt?: string
  nationalTaxServiceSendErrorCode?: string
  modificationCode?: number
  isApiLinkedDocument: boolean
  supplierCompanyName: string
  supplierBusinessNumber: string
  supplierManagementKey?: string
  isSupplierPrinted: boolean
  buyerCompanyName: string
  buyerBusinessNumber: string
  buyerManagementKey?: string
  isBuyerPrinted: boolean
  buyerCloseDownState?: CloseDownState
  buyerCloseDownDate?: string
  trusteeCompanyName?: string
  trusteeBusinessNumber?: string
  trusteeManagementKey?: string
  isTrusteePrinted?: boolean
}

/**
 * TaxInvoice modern facade 서비스 인터페이스입니다.
 *
 * 모든 메서드는 `input`과 선택 `options`만 받으며,
 * 실패 시 `PopbillApiError`를 throw 합니다.
 *
 * `options.userId`는 요청 단위 사용자 컨텍스트를 강제할 때 사용합니다.
 */
export interface TaxInvoiceService {
  /** 등록과 동시에 세금계산서를 즉시 발행합니다. */
  issueInvoiceImmediately(input: IssueInvoiceImmediatelyInput, options?: TaxInvoiceRequestOptions): Promise<TaxInvoiceRegistIssueApiResponse>
  /** 초대량 발행을 접수합니다. */
  submitBulkIssue(input: SubmitBulkIssueInput, options?: TaxInvoiceRequestOptions): Promise<TaxInvoiceBulkSubmitApiResponse>
  /** 초대량 발행 접수결과를 조회합니다. */
  getBulkIssueSubmissionResult(input: GetBulkIssueSubmissionResultInput, options?: TaxInvoiceRequestOptions): Promise<TaxInvoiceGetBulkResultApiResponse>
  /** 세금계산서를 임시저장합니다. */
  registerInvoice(input: RegisterInvoiceInput, options?: TaxInvoiceRequestOptions): Promise<TaxInvoiceApiResponseBase>
  /** 임시저장 문서를 수정합니다. */
  updateInvoice(input: UpdateInvoiceInput, options?: TaxInvoiceRequestOptions): Promise<TaxInvoiceApiResponseBase>
  /** 저장된 문서를 발행합니다. */
  issueInvoice(input: IssueInvoiceInput, options?: TaxInvoiceRequestOptions): Promise<TaxInvoiceIssueApiResponse>
  /** 발행된 문서를 취소합니다. */
  cancelIssuedInvoice(input: CancelIssuedInvoiceInput, options?: TaxInvoiceRequestOptions): Promise<TaxInvoiceApiResponseBase>
  /** 등록과 동시에 역발행 요청을 보냅니다. */
  requestReverseIssueImmediately(input: RequestReverseIssueImmediatelyInput, options?: TaxInvoiceRequestOptions): Promise<TaxInvoiceApiResponseBase>
  /** 저장된 문서로 역발행 요청을 보냅니다. */
  requestReverseIssue(input: RequestReverseIssueInput, options?: TaxInvoiceRequestOptions): Promise<TaxInvoiceApiResponseBase>
  /** 역발행 요청을 취소합니다. */
  cancelReverseIssueRequest(input: CancelReverseIssueRequestInput, options?: TaxInvoiceRequestOptions): Promise<TaxInvoiceApiResponseBase>
  /** 역발행 요청을 거부합니다. */
  refuseReverseIssueRequest(input: RefuseReverseIssueRequestInput, options?: TaxInvoiceRequestOptions): Promise<TaxInvoiceApiResponseBase>
  /** 문서를 삭제합니다. */
  deleteInvoice(input: TaxInvoiceDocumentRequest, options?: TaxInvoiceRequestOptions): Promise<TaxInvoiceApiResponseBase>
  /** 문서를 국세청으로 즉시 전송합니다. */
  sendInvoiceToNTS(input: TaxInvoiceDocumentRequest, options?: TaxInvoiceRequestOptions): Promise<TaxInvoiceApiResponseBase>

  /** 문서 1건의 상태 요약정보를 조회합니다. */
  getInvoiceInfo(input: TaxInvoiceDocumentRequest, options?: TaxInvoiceRequestOptions): Promise<TaxInvoiceInfo>
  /** 문서 다건의 상태 요약정보를 조회합니다. */
  getInvoicesInfo(input: GetInvoicesInfoInput, options?: TaxInvoiceRequestOptions): Promise<TaxInvoiceGetInfosApiResponse>
  /** 문서 1건의 상세정보를 조회합니다. */
  getInvoiceDetailInfo(input: TaxInvoiceDocumentRequest, options?: TaxInvoiceRequestOptions): Promise<TaxInvoiceGetDetailInfoApiResponse>
  /** 문서번호 사용 여부를 확인합니다. */
  checkInvoiceManagementKeyInUse(input: TaxInvoiceDocumentRequest, options?: TaxInvoiceRequestOptions): Promise<boolean>
  /** 문서 XML 정보를 조회합니다. */
  getInvoiceXML(input: TaxInvoiceDocumentRequest, options?: TaxInvoiceRequestOptions): Promise<TaxInvoiceGetXmlApiResponse>
  /** 검색조건으로 문서를 조회합니다. */
  searchInvoices(input: SearchInvoicesInput, options?: TaxInvoiceRequestOptions): Promise<TaxInvoiceSearchApiResponse>
  /** 문서 상태 변경이력을 조회합니다. */
  getInvoiceLogs(input: TaxInvoiceDocumentRequest, options?: TaxInvoiceRequestOptions): Promise<TaxInvoiceGetLogsApiResponse>
  /** 세금계산서 문서함 팝업 URL을 조회합니다. */
  getTaxInvoiceBoxURL(input: GetTaxInvoiceBoxURLInput, options?: TaxInvoiceRequestOptions): Promise<string>

  /** 문서 팝업 URL을 조회합니다. */
  getInvoicePopupURL(input: TaxInvoiceDocumentRequest, options?: TaxInvoiceRequestOptions): Promise<string>
  /** 보기 전용 팝업 URL을 조회합니다. */
  getInvoiceViewURL(input: TaxInvoiceDocumentRequest, options?: TaxInvoiceRequestOptions): Promise<string>
  /** 공급자 인쇄 팝업 URL을 조회합니다. */
  getSupplierInvoicePrintURL(input: TaxInvoiceDocumentRequest, options?: TaxInvoiceRequestOptions): Promise<string>
  /** 공급받는자 인쇄 팝업 URL을 조회합니다. */
  getBuyerInvoicePrintURL(input: TaxInvoiceDocumentRequest, options?: TaxInvoiceRequestOptions): Promise<string>
  /** 다건 인쇄 팝업 URL을 조회합니다. */
  getBulkInvoicePrintURL(input: GetBulkInvoicePrintURLInput, options?: TaxInvoiceRequestOptions): Promise<string>
  /** 메일 보기 URL을 조회합니다. */
  getInvoiceMailURL(input: TaxInvoiceDocumentRequest, options?: TaxInvoiceRequestOptions): Promise<string>
  /** PDF 다운로드 URL을 조회합니다. */
  getInvoicePDFURL(input: TaxInvoiceDocumentRequest, options?: TaxInvoiceRequestOptions): Promise<string>

  /** 인감 및 첨부문서 등록 URL을 조회합니다. */
  getSealAndAttachmentRegistrationURL(input: GetSealAndAttachmentRegistrationURLInput, options?: TaxInvoiceRequestOptions): Promise<TaxInvoiceGetSealUrlApiResponse>
  /** 파일 경로 기반 첨부를 수행합니다. */
  attachFileFromPath(input: AttachFileFromPathInput, options?: TaxInvoiceRequestOptions): Promise<TaxInvoiceApiResponseBase>
  /** 바이너리 기반 첨부를 수행합니다. */
  attachFileFromBinary(input: AttachFileFromBinaryInput, options?: TaxInvoiceRequestOptions): Promise<TaxInvoiceApiResponseBase>
  /** 첨부파일을 삭제합니다. */
  deleteAttachedFile(input: DeleteAttachedFileInput, options?: TaxInvoiceRequestOptions): Promise<TaxInvoiceApiResponseBase>
  /** 첨부파일 목록을 조회합니다. */
  getAttachedFiles(input: TaxInvoiceDocumentRequest, options?: TaxInvoiceRequestOptions): Promise<TaxInvoiceGetFilesApiResponse>
  /** 안내 메일을 재전송합니다. */
  resendInvoiceEmail(input: ResendInvoiceEmailInput, options?: TaxInvoiceRequestOptions): Promise<TaxInvoiceApiResponseBase>
  /** 안내 문자를 재전송합니다. */
  resendInvoiceSMS(input: ResendInvoiceSMSInput, options?: TaxInvoiceRequestOptions): Promise<TaxInvoiceApiResponseBase>
  /** 안내 팩스를 재전송합니다. */
  resendInvoiceFAX(input: ResendInvoiceFAXInput, options?: TaxInvoiceRequestOptions): Promise<TaxInvoiceApiResponseBase>
  /** 전자명세서를 첨부합니다. */
  attachInvoiceStatement(input: AttachInvoiceStatementInput, options?: TaxInvoiceRequestOptions): Promise<TaxInvoiceApiResponseBase>
  /** 전자명세서 첨부를 해제합니다. */
  detachInvoiceStatement(input: DetachInvoiceStatementInput, options?: TaxInvoiceRequestOptions): Promise<TaxInvoiceApiResponseBase>
  /** 문서번호를 할당합니다. */
  assignInvoiceManagementKey(input: AssignInvoiceManagementKeyInput, options?: TaxInvoiceRequestOptions): Promise<TaxInvoiceApiResponseBase>
  /** 이메일 발송설정을 조회합니다. */
  getEmailSendSettings(input: TaxInvoiceBusinessRequest, options?: TaxInvoiceRequestOptions): Promise<TaxInvoiceListEmailConfigApiResponse>
  /** 이메일 발송설정을 수정합니다. */
  updateEmailSendSettings(input: UpdateEmailSendSettingsInput, options?: TaxInvoiceRequestOptions): Promise<TaxInvoiceApiResponseBase>
  /** 국세청 전송설정을 조회합니다. */
  getSendToNTSSettings(input: TaxInvoiceBusinessRequest, options?: TaxInvoiceRequestOptions): Promise<TaxInvoiceGetSendToNTSConfigApiResponse>

  /** 인증서 등록 URL을 조회합니다. */
  getTaxCertificateRegistrationURL(input: TaxInvoiceBusinessRequest, options?: TaxInvoiceRequestOptions): Promise<TaxInvoiceGetTaxCertUrlApiResponse>
  /** 인증서 만료일을 조회합니다. */
  getTaxCertificateExpirationDate(input: TaxInvoiceBusinessRequest, options?: TaxInvoiceRequestOptions): Promise<string>
  /** 인증서 유효성을 점검합니다. */
  checkTaxCertificateValidation(input: TaxInvoiceBusinessRequest, options?: TaxInvoiceRequestOptions): Promise<TaxInvoiceApiResponseBase>
  /** 인증서 정보를 조회합니다. */
  getTaxCertificateInfo(input: TaxInvoiceBusinessRequest, options?: TaxInvoiceRequestOptions): Promise<TaxInvoiceGetTaxCertInfoApiResponse>
}
