import type * as document from './document'
import type { ProviderBoolean, ProviderNumericCode } from '@/internal/response'

/**
 * 세금계산서 공통 처리 결과입니다.
 */
export interface TaxInvoiceOperationResult {
  /**
   * 처리 결과 코드입니다.
   */
  resultCode: ProviderNumericCode | undefined
  /**
   * 처리 결과 메시지입니다.
   */
  resultMessage: string
}

/**
 * 발행 처리 결과입니다.
 */
export interface TaxInvoiceIssueResult extends TaxInvoiceOperationResult {
  /**
   * 국세청 승인번호입니다.
   */
  nationalTaxServiceConfirmationNumber?: string
  /**
   * 발행일시(yyyyMMddHHmmss)입니다.
   */
  issuedAt?: string
}

/**
 * 초대량 접수 결과입니다.
 */
export interface TaxInvoiceBulkSubmitResult extends TaxInvoiceOperationResult {
  /**
   * 접수 식별자입니다.
   */
  receiptIdentifier?: string
}

/**
 * 초대량 처리 상태 값입니다.
 */
export const TaxInvoiceBulkIssueSubmissionTransactionStates = {
  /**
   * 값: `0`, 의미: 미처리 상태
   */
  NotProcessed: 0,
  /**
   * 값: `1`, 의미: 처리중 상태
   */
  Processing: 1,
  /**
   * 값: `2`, 의미: 완료 상태
   */
  Completed: 2,
} as const

/**
 * 초대량 처리 상태 타입입니다.
 */
export type TaxInvoiceBulkIssueSubmissionTransactionState = ProviderNumericCode

/**
 * 초대량 발행 개별 처리 결과입니다.
 */
export interface TaxInvoiceBulkIssueSubmissionResultItem {
  /**
   * 문서번호 유형 코드입니다.
   */
  invoiceDocumentKeyTypeCode?: string
  /**
   * 공급자 문서번호입니다.
   */
  supplierInvoiceManagementKey?: string
  /**
   * 수탁자 문서번호입니다.
   */
  trusteeInvoiceManagementKey?: string
  /**
   * 개별 처리 결과 코드입니다.
   */
  resultCode?: ProviderNumericCode
  /**
   * 개별 처리 결과 메시지입니다.
   */
  resultMessage?: string
  /**
   * 국세청 승인번호입니다.
   */
  nationalTaxServiceConfirmationNumber?: string
  /**
   * 접수일시(yyyyMMddHHmmss)입니다.
   */
  receivedAt?: string
  /**
   * 발행일시(yyyyMMddHHmmss)입니다.
   */
  issuedAt?: string
}

/**
 * 초대량 접수결과 조회 결과입니다.
 */
export interface TaxInvoiceBulkIssueSubmissionResult extends TaxInvoiceOperationResult {
  /**
   * 제출 식별자입니다.
   */
  submissionIdentifier?: string
  /**
   * 접수 식별자입니다.
   */
  receiptIdentifier?: string
  /**
   * 제출 건수입니다.
   */
  submittedDocumentCount?: number
  /**
   * 성공 건수입니다.
   */
  succeededDocumentCount?: number
  /**
   * 실패 건수입니다.
   */
  failedDocumentCount?: number
  /**
   * 처리 상태입니다.
   */
  transactionState?: TaxInvoiceBulkIssueSubmissionTransactionState
  /**
   * 처리 결과 코드입니다.
   */
  transactionResultCode?: ProviderNumericCode
  /**
   * 개별 처리 결과 목록입니다.
   */
  issueResults?: TaxInvoiceBulkIssueSubmissionResultItem[]
  /**
   * 접수일시(yyyyMMddHHmmss)입니다.
   */
  receivedAt?: string
  /**
   * 처리 시작일시(yyyyMMddHHmmss)입니다.
   */
  transactionStartedAt?: string
  /**
   * 처리 완료일시(yyyyMMddHHmmss)입니다.
   */
  transactionCompletedAt?: string
}

/**
 * 문서 요약정보 조회 결과입니다.
 */
export interface TaxInvoiceInfo {
  /**
   * 팝빌 문서 식별키(ItemKey)입니다.
   */
  itemKey: string
  /**
   * 국세청 승인번호입니다.
   */
  nationalTaxServiceConfirmationNumber?: string
  /**
   * 공급자 사업자번호입니다.
   */
  supplierBusinessNumber: string
  /**
   * 공급자 문서번호입니다.
   */
  supplierManagementKey?: string
  /**
   * 공급받는자 사업자번호입니다.
   */
  buyerBusinessNumber: string
  /**
   * 공급받는자 문서번호입니다.
   */
  buyerManagementKey?: string
  /**
   * 수탁자 사업자번호입니다.
   */
  trusteeBusinessNumber?: string
  /**
   * 수탁자 문서번호입니다.
   */
  trusteeManagementKey?: string
  /**
   * 과세유형입니다.
   */
  taxType: string | null
  /**
   * 발행유형입니다.
   */
  issueType: string | null
  /**
   * 영수/청구 구분입니다.
   */
  purposeType: string | null
  /**
   * 공급가액 합계입니다.
   */
  totalSupplyCost: string
  /**
   * 세액 합계입니다.
   */
  totalTax: string
  /**
   * 수정사유코드입니다.
   */
  modificationCode?: ProviderNumericCode
  /**
   * 공급자 상호입니다.
   */
  supplierCompanyName: string
  /**
   * 공급받는자 상호입니다.
   */
  buyerCompanyName: string
  /**
   * 수탁자 상호입니다.
   */
  trusteeCompanyName?: string
  /**
   * 상태 코드입니다.
   */
  stateCode?: ProviderNumericCode
  /**
   * 상태 메모입니다.
   */
  stateMemo?: string
  /**
   * 국세청 전송 결과 코드입니다.
   */
  nationalTaxServiceResult?: ProviderNumericCode
  /**
   * 국세청 전송 오류 코드입니다.
   */
  nationalTaxServiceSendErrorCode?: ProviderNumericCode
  /**
   * 지연발행 여부입니다.
   */
  isLateIssued?: ProviderBoolean
  /**
   * 개봉 여부입니다.
   */
  isOpen?: ProviderBoolean
  /**
   * 연동 문서 여부입니다.
   */
  isApiLinkedDocument?: ProviderBoolean
  /**
   * 공급자 인쇄 여부입니다.
   */
  isSupplierPrinted?: ProviderBoolean
  /**
   * 공급받는자 인쇄 여부입니다.
   */
  isBuyerPrinted?: ProviderBoolean
  /**
   * 수탁자 인쇄 여부입니다.
   */
  isTrusteePrinted?: ProviderBoolean
  /**
   * 공급받는자 휴폐업 상태입니다.
   */
  buyerBusinessStatus?: ProviderNumericCode
  /**
   * 작성일자(yyyyMMdd)입니다.
   */
  writtenDate: string
  /**
   * 등록일시(yyyyMMddHHmmss)입니다.
   */
  registeredAt: string
  /**
   * 발행일시(yyyyMMddHHmmss)입니다.
   */
  issuedAt?: string
  /**
   * 상태 변경일시(yyyyMMddHHmmss)입니다.
   */
  stateChangedAt: string
  /**
   * 개봉일시(yyyyMMddHHmmss)입니다.
   */
  openedAt?: string
  /**
   * 국세청 전송일시(yyyyMMddHHmmss)입니다.
   */
  nationalTaxServiceSentAt?: string
  /**
   * 국세청 결과 수신일시(yyyyMMddHHmmss)입니다.
   */
  nationalTaxServiceResultReceivedAt?: string
  /**
   * 공급받는자 휴폐업일자(yyyyMMdd)입니다.
   */
  buyerBusinessStatusDate?: string
}

/**
 * 서버가 반환한 공급자·수탁자 플래그를 보존하는 정보입니다.
 */
export interface TaxInvoicePartyOutput extends Omit<document.TaxInvoicePartyInput, 'sendTextMessage' | 'printEnabled'> {
  sendTextMessage?: ProviderBoolean
  printEnabled?: ProviderBoolean
}

/** 공급받는자 분류와 플래그는 새로운 서버 값도 보존합니다. */
export interface TaxInvoiceBuyerOutput extends Omit<
  document.TaxInvoiceBuyerInput,
  'sendTextMessage' | 'printEnabled' | 'recipientType' | 'businessStatus'
> {
  sendTextMessage?: ProviderBoolean
  printEnabled?: ProviderBoolean
  recipientType?: string | null
  businessStatus?: ProviderNumericCode
}

/** 서버가 반환한 수정사유 코드를 보존합니다. */
export interface TaxInvoiceModificationOutput extends Omit<document.TaxInvoiceModificationInput, 'modificationReasonCode'> {
  modificationReasonCode?: ProviderNumericCode
}

/** 문서 상세조회 결과입니다. 입력 enum과 별도로 서버의 새 분류값을 보존합니다. */
export interface TaxInvoiceDocumentOutput extends Omit<
  document.TaxInvoiceDocumentInput,
  | 'issueType'
  | 'taxType'
  | 'purposeType'
  | 'chargeDirection'
  | 'supplier'
  | 'buyer'
  | 'trustee'
  | 'modification'
  | 'writeSpecificationEnabled'
  | 'includeBusinessLicenseImage'
  | 'includeBankBookImage'
> {
  issueType?: string | null
  taxType?: string | null
  purposeType?: string | null
  chargeDirection?: string | null
  supplier?: TaxInvoicePartyOutput
  buyer?: TaxInvoiceBuyerOutput
  trustee?: TaxInvoicePartyOutput
  modification?: TaxInvoiceModificationOutput
  writeSpecificationEnabled?: ProviderBoolean
  includeBusinessLicenseImage?: ProviderBoolean
  includeBankBookImage?: ProviderBoolean
  /**
   * 국세청 승인번호입니다.
   */
  nationalTaxServiceConfirmationNumber?: string
  /**
   * 상태 코드입니다.
   */
  stateCode?: ProviderNumericCode
  /**
   * 국세청 전송 결과 코드입니다.
   */
  nationalTaxServiceResultCode?: ProviderNumericCode
  /**
   * 국세청 전송 오류 코드입니다.
   */
  nationalTaxServiceSendErrorCode?: ProviderNumericCode
  /**
   * 지연발행 여부입니다.
   */
  isLateIssued?: ProviderBoolean
  /**
   * 개봉 여부입니다.
   */
  isOpen?: ProviderBoolean
  /**
   * API 연동 문서 여부입니다.
   */
  isApiLinkedDocument?: ProviderBoolean
  /**
   * 발행일시(yyyyMMddHHmmss)입니다.
   */
  issuedAt?: string
  /**
   * 상태 변경일시(yyyyMMddHHmmss)입니다.
   */
  stateChangedAt?: string
  /**
   * 개봉일시(yyyyMMddHHmmss)입니다.
   */
  openedAt?: string
  /**
   * 국세청 전송일시(yyyyMMddHHmmss)입니다.
   */
  nationalTaxServiceSentAt?: string
  /**
   * 국세청 결과 수신일시(yyyyMMddHHmmss)입니다.
   */
  nationalTaxServiceResultReceivedAt?: string
}

/**
 * 문서번호 사용 여부 조회 결과입니다.
 */
export interface TaxInvoiceInvoiceManagementKeyUsage {
  /**
   * 문서번호 사용 여부입니다.
   */
  isInUse: boolean
  /**
   * 사용중인 경우 팝빌 문서 식별키입니다.
   */
  itemKey?: string
}

/**
 * XML 조회 결과입니다.
 */
export interface TaxInvoiceXmlResult {
  /**
   * 처리 결과입니다.
   */
  operationResult?: TaxInvoiceOperationResult
  /**
   * 팝빌 문서 식별키입니다.
   */
  itemKey?: string
  /**
   * 문서번호입니다.
   */
  invoiceManagementKey?: string
  /**
   * XML 원문입니다.
   */
  xmlContent?: string
}

export interface TaxInvoicePdfDocument {
  /** PDF 원본 바이트. */
  fileData: Uint8Array
}

/**
 * 검색 조회 결과입니다.
 */
export interface TaxInvoiceSearchResult {
  /**
   * 처리 결과입니다.
   */
  operationResult: TaxInvoiceOperationResult
  /**
   * 현재 페이지 번호입니다.
   */
  pageNumber?: number
  /**
   * 페이지당 건수입니다.
   */
  pageSize?: number
  /**
   * 전체 페이지 수입니다.
   */
  pageCount?: number
  /**
   * 총 검색 건수입니다.
   */
  totalCount?: number
  /**
   * 문서 요약 목록입니다.
   */
  invoiceSummaries: TaxInvoiceInfo[]
}

/**
 * 문서 상태 이력 항목입니다.
 */
export interface TaxInvoiceLogEntry {
  /**
   * 문서 이력 유형 코드입니다.
   */
  documentLogTypeCode?: ProviderNumericCode
  /**
   * 로그 메시지입니다.
   */
  logMessage?: string
  /**
   * 처리 유형 코드입니다.
   */
  processTypeCode?: string | null
  /**
   * 처리 회사명입니다.
   */
  processCompanyName?: string
  /**
   * 처리 담당자명입니다.
   */
  processContactName?: string
  /**
   * 처리 설명입니다.
   */
  processDescription?: string
  /**
   * 등록일시(yyyyMMddHHmmss)입니다.
   */
  registeredAt?: string
  /**
   * 처리 IP 주소입니다.
   */
  ipAddress?: string
}

/**
 * URL 응답 결과입니다.
 */
export interface TaxInvoiceAccessUrl {
  /**
   * 접근 URL입니다.
   */
  accessUrl: string
}

/**
 * 첨부파일 메타데이터입니다.
 */
export interface TaxInvoiceAttachedFile {
  /**
   * 첨부 순번입니다.
   */
  sequenceNumber?: number
  /**
   * 파일 식별자입니다.
   */
  fileIdentifier?: string
  /**
   * 표시 이름입니다.
   */
  displayName?: string
  /**
   * 등록일시(yyyyMMddHHmmss)입니다.
   */
  registeredAt?: string
}

/**
 * 이메일 전송 설정 항목입니다.
 */
export interface TaxInvoiceEmailSendSetting {
  /**
   * 메일 유형 코드입니다.
   */
  emailTypeCode?: string | null
  /**
   * 전송 활성화 여부입니다.
   */
  sendEnabled?: ProviderBoolean
}

/**
 * 국세청 전송 설정입니다.
 */
export interface TaxInvoiceSendToNationalTaxServiceSetting {
  /**
   * 즉시 전송 여부입니다.
   */
  sendToNationalTaxServiceEnabled?: ProviderBoolean
}

/** ASP사업자 유통메일 공개키 조회 결과입니다. */
export interface TaxInvoiceEmailPublicKeys {
  /** 공식 SDK의 원본 응답입니다. 공개된 필드 계약이 없어 사용 전에 구조를 확인해야 합니다. */
  publicKeys: unknown
}

/**
 * 인증서 만료일 조회 결과입니다.
 */
export interface TaxInvoiceTaxCertificateExpiration {
  /**
   * 만료일시(yyyyMMddHHmmss)입니다.
   */
  expirationDateTime: string
}

/**
 * 인증서 정보 조회 결과입니다.
 */
export interface TaxInvoiceTaxCertificateInfo {
  /**
   * 발급자 DN입니다.
   */
  issuerDistinguishedName?: string
  /**
   * 인증서 DN입니다.
   */
  subjectDistinguishedName?: string
  /**
   * 인증서 종류명입니다.
   */
  issuerName?: string
  /**
   * 인증서 정책 OID입니다.
   */
  policyObjectIdentifier?: string
  /**
   * 등록 담당자 아이디입니다.
   */
  registeredContactIdentifier?: string
  /**
   * 등록 담당자 이름입니다.
   */
  registeredContactName?: string
  /**
   * 등록일시(yyyyMMddHHmmss)입니다.
   */
  registeredAt?: string
  /**
   * 만료일시(yyyyMMddHHmmss)입니다.
   */
  expiredAt?: string
}

/** 전자세금계산서 과금정보. */
export interface TaxInvoiceChargeInfo {
  /** 정밀도 손실 없는 단가 문자열. */
  unitCost: string
  chargeMethod: string | null
  rateSystem: string | null
}

export interface TaxInvoiceUnitCost {
  unitCost: string
}
