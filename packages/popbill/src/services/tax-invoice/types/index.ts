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
  /** 발행할 세금계산서 문서 원본입니다. */
  taxInvoiceDocument: TaxInvoiceApiModel
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
  taxInvoiceDocuments: TaxInvoiceApiModel[]
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
  taxInvoiceDocument: TaxInvoiceApiModel
}

/**
 * 문서 수정 요청 입력입니다.
 */
export interface UpdateInvoiceInput extends TaxInvoiceDocumentRequest {
  /** 수정할 세금계산서 문서 원본입니다. */
  taxInvoiceDocument: TaxInvoiceApiModel
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
  taxInvoiceDocument: TaxInvoiceApiModel
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
  sortOrder: 'A' | 'D' | string
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
 * 문서 요약정보 조회 결과입니다.
 */
export interface TaxInvoiceInfo {
  /** 팝빌 문서 식별키(ItemKey)입니다. */
  itemKey: string
  /** 과세형태입니다. */
  taxType: TaxType
  /** 작성일자(yyyyMMdd)입니다. */
  writtenDate: string
  /** 등록일시(yyyyMMddHHmmss)입니다. */
  registeredAt: string
  /** 발행형태입니다. */
  issueType: IssueType
  /** 공급가액 합계입니다. */
  totalSupplyCost: string
  /** 세액 합계입니다. */
  totalTax: string
  /** 영수/청구 구분입니다. */
  purposeType: PurposeType
  /** 발행일시(yyyyMMddHHmmss)입니다. */
  issuedAt: string
  /** 지연발행 여부입니다. */
  isLateIssued: boolean
  /** 개봉 여부입니다. */
  isOpen: boolean
  /** 개봉일시(yyyyMMddHHmmss)입니다. */
  openedAt?: string
  /** 상태 메모입니다. */
  stateMemo: string
  /** 상태 코드입니다. */
  stateCode: number
  /** 상태 변경일시(yyyyMMddHHmmss)입니다. */
  stateChangedAt: string
  /** 국세청 승인번호입니다. */
  nationalTaxServiceConfirmationNumber?: string
  /** 국세청 전송 결과코드입니다. */
  nationalTaxServiceResult?: string
  /** 국세청 전송일시(yyyyMMddHHmmss)입니다. */
  nationalTaxServiceSentAt?: string
  /** 국세청 결과 수신일시(yyyyMMddHHmmss)입니다. */
  nationalTaxServiceResultReceivedAt?: string
  /** 국세청 전송 오류코드입니다. */
  nationalTaxServiceSendErrorCode?: string
  /** 수정세금계산서 사유코드입니다. */
  modificationCode?: number
  /** API 연동 문서 여부입니다. */
  isApiLinkedDocument: boolean
  /** 공급자 상호입니다. */
  supplierCompanyName: string
  /** 공급자 사업자번호입니다. */
  supplierBusinessNumber: string
  /** 공급자 문서번호입니다. */
  supplierManagementKey?: string
  /** 공급자 인쇄 여부입니다. */
  isSupplierPrinted: boolean
  /** 공급받는자 상호입니다. */
  buyerCompanyName: string
  /** 공급받는자 사업자번호입니다. */
  buyerBusinessNumber: string
  /** 공급받는자 문서번호입니다. */
  buyerManagementKey?: string
  /** 공급받는자 인쇄 여부입니다. */
  isBuyerPrinted: boolean
  /** 공급받는자 휴폐업 상태입니다. */
  buyerCloseDownState?: CloseDownState
  /** 공급받는자 휴폐업일자(yyyyMMdd)입니다. */
  buyerCloseDownDate?: string
  /** 수탁자 상호입니다. */
  trusteeCompanyName?: string
  /** 수탁자 사업자번호입니다. */
  trusteeBusinessNumber?: string
  /** 수탁자 문서번호입니다. */
  trusteeManagementKey?: string
  /** 수탁자 인쇄 여부입니다. */
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
