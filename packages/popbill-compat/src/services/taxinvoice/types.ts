import type { CallbackService } from '@/adapters/callback-adapter'
import type { PromiseService } from '@/adapters/promise-adapter'
import type * as Spec from '@connextable/popbill-spec'

/**
 * 세금계산서 문서번호 유형 상수입니다.
 */
export const TaxinvoiceDocumentKeyTypes = {
  /**
   * 코드: `SELL`, 설명: 매출 문서번호 유형
   */
  Sales: 'SELL',
  /**
   * 코드: `BUY`, 설명: 매입 문서번호 유형
   */
  Purchase: 'BUY',
  /**
   * 코드: `TRUSTEE`, 설명: 위수탁 문서번호 유형
   */
  Trustee: 'TRUSTEE',
} as const

/**
 * 세금계산서 문서번호 유형입니다.
 */
export type TaxinvoiceDocumentKeyType = (typeof TaxinvoiceDocumentKeyTypes)[keyof typeof TaxinvoiceDocumentKeyTypes]
export type TaxinvoiceOutboundDocumentKeyType = Extract<
  TaxinvoiceDocumentKeyType,
  typeof TaxinvoiceDocumentKeyTypes.Sales | typeof TaxinvoiceDocumentKeyTypes.Trustee
>
export type TaxinvoiceReverseRequestDocumentKeyType = typeof TaxinvoiceDocumentKeyTypes.Purchase
export type TaxinvoiceReverseRefuseDocumentKeyType = typeof TaxinvoiceDocumentKeyTypes.Sales

/**
 * 세금계산서 문서함 접근 메뉴 상수입니다.
 */
export const TaxinvoiceBoxScopes = {
  /**
   * 코드: `TBOX`, 설명: 임시 문서함
   */
  TemporaryDocumentBox: 'TBOX',
  /**
   * 코드: `SWBOX`, 설명: 매출 발행 대기함
   */
  SalesIssueWaitingBox: 'SWBOX',
  /**
   * 코드: `SBOX`, 설명: 매출 문서함
   */
  SalesDocumentBox: 'SBOX',
  /**
   * 코드: `PWBOX`, 설명: 매입 발행 대기함
   */
  PurchaseIssueWaitingBox: 'PWBOX',
  /**
   * 코드: `PBOX`, 설명: 매입 문서함
   */
  PurchaseDocumentBox: 'PBOX',
  /**
   * 코드: `WRITE`, 설명: 정발행 작성
   */
  WriteInvoice: 'WRITE',
} as const

/**
 * 세금계산서 문서함 접근 메뉴 값입니다.
 */
export type TaxinvoiceBoxScope = (typeof TaxinvoiceBoxScopes)[keyof typeof TaxinvoiceBoxScopes]

/**
 * 검색 휴폐업상태 코드입니다.
 *
 * legacy 숫자 입력과 스펙 문자열 코드(`N`, `0`~`4`)를 모두 허용합니다.
 */
export type TaxinvoiceSearchCloseDownStateCode = 'N' | '0' | '1' | '2' | '3' | '4' | 0 | 1 | 2 | 3 | 4

export type LegacySuccessCallback<T> = (response: T) => void

export type LegacyErrorCallback = (error: unknown) => void

interface LegacyCallbackWithUserId<TArgs extends unknown[], TResult> {
  (...args: TArgs): void
  (...args: [...TArgs, success: LegacySuccessCallback<TResult>, error?: LegacyErrorCallback]): void
  (...args: [...TArgs, userId: string, success: LegacySuccessCallback<TResult>, error?: LegacyErrorCallback]): void
}

interface LegacySendCallback {
  (corpNum: string, keyType: TaxinvoiceDocumentKeyType, mgtKey: string, memo: string): void
  (
    corpNum: string,
    keyType: TaxinvoiceDocumentKeyType,
    mgtKey: string,
    memo: string,
    success: LegacySuccessCallback<Spec.TaxInvoiceApiResponseBase>,
    error?: LegacyErrorCallback
  ): void
  (
    corpNum: string,
    keyType: TaxinvoiceDocumentKeyType,
    mgtKey: string,
    memo: string,
    userId: string,
    success: LegacySuccessCallback<Spec.TaxInvoiceApiResponseBase>,
    error?: LegacyErrorCallback
  ): void
  (
    corpNum: string,
    keyType: TaxinvoiceDocumentKeyType,
    mgtKey: string,
    memo: string,
    emailSubject: string,
    success: LegacySuccessCallback<Spec.TaxInvoiceApiResponseBase>,
    error?: LegacyErrorCallback
  ): void
  (
    corpNum: string,
    keyType: TaxinvoiceDocumentKeyType,
    mgtKey: string,
    memo: string,
    emailSubject: string,
    userId: string,
    success: LegacySuccessCallback<Spec.TaxInvoiceApiResponseBase>,
    error?: LegacyErrorCallback
  ): void
}

interface LegacyIssueCallback {
  (corpNum: string, keyType: TaxinvoiceOutboundDocumentKeyType, mgtKey: string): void
  (
    corpNum: string,
    keyType: TaxinvoiceOutboundDocumentKeyType,
    mgtKey: string,
    success: LegacySuccessCallback<Spec.TaxInvoiceIssueApiResponse>,
    error?: LegacyErrorCallback
  ): void
  (corpNum: string, keyType: TaxinvoiceOutboundDocumentKeyType, mgtKey: string, memo: string): void
  (
    corpNum: string,
    keyType: TaxinvoiceOutboundDocumentKeyType,
    mgtKey: string,
    memo: string,
    success: LegacySuccessCallback<Spec.TaxInvoiceIssueApiResponse>,
    error?: LegacyErrorCallback
  ): void
  (
    corpNum: string,
    keyType: TaxinvoiceOutboundDocumentKeyType,
    mgtKey: string,
    memo: string,
    userId: string,
    success: LegacySuccessCallback<Spec.TaxInvoiceIssueApiResponse>,
    error?: LegacyErrorCallback
  ): void
  (
    corpNum: string,
    keyType: TaxinvoiceOutboundDocumentKeyType,
    mgtKey: string,
    memo: string,
    forceIssue: boolean,
    success: LegacySuccessCallback<Spec.TaxInvoiceIssueApiResponse>,
    error?: LegacyErrorCallback
  ): void
  (
    corpNum: string,
    keyType: TaxinvoiceOutboundDocumentKeyType,
    mgtKey: string,
    memo: string,
    forceIssue: boolean,
    userId: string,
    success: LegacySuccessCallback<Spec.TaxInvoiceIssueApiResponse>,
    error?: LegacyErrorCallback
  ): void
  (
    corpNum: string,
    keyType: TaxinvoiceOutboundDocumentKeyType,
    mgtKey: string,
    memo: string,
    emailSubject: string,
    userId: string,
    success: LegacySuccessCallback<Spec.TaxInvoiceIssueApiResponse>,
    error?: LegacyErrorCallback
  ): void
  (
    corpNum: string,
    keyType: TaxinvoiceOutboundDocumentKeyType,
    mgtKey: string,
    memo: string,
    emailSubject: string,
    forceIssue: boolean,
    success: LegacySuccessCallback<Spec.TaxInvoiceIssueApiResponse>,
    error?: LegacyErrorCallback
  ): void
  (
    corpNum: string,
    keyType: TaxinvoiceOutboundDocumentKeyType,
    mgtKey: string,
    memo: string,
    emailSubject: string,
    forceIssue: boolean,
    userId: string,
    success: LegacySuccessCallback<Spec.TaxInvoiceIssueApiResponse>,
    error?: LegacyErrorCallback
  ): void
}

interface LegacySearchCallback {
  (
    corpNum: string,
    keyType: TaxinvoiceDocumentKeyType,
    dType: string,
    startDate: string,
    endDate: string,
    state: string[],
    type: string[],
    taxType: string[],
    lateOnly: boolean | null,
    order: string,
    page: number,
    perPage: number
  ): void
  (
    corpNum: string,
    keyType: TaxinvoiceDocumentKeyType,
    dType: string,
    startDate: string,
    endDate: string,
    state: string[],
    type: string[],
    taxType: string[],
    lateOnly: boolean | null,
    order: string,
    page: number,
    perPage: number,
    success: LegacySuccessCallback<Spec.TaxInvoiceSearchApiResponse>,
    error?: LegacyErrorCallback
  ): void
  (
    corpNum: string,
    keyType: TaxinvoiceDocumentKeyType,
    dType: string,
    startDate: string,
    endDate: string,
    state: string[],
    type: string[],
    taxType: string[],
    lateOnly: boolean | null,
    order: string,
    page: number,
    perPage: number,
    taxRegIDType?: string,
    taxRegIDYN?: string,
    taxRegID?: string,
    qString?: string,
    interOPYN?: string,
    userId?: string,
    issueType?: string[],
    regType?: string[],
    closeDownState?: TaxinvoiceSearchCloseDownStateCode[],
    mgtKey?: string,
    success?: LegacySuccessCallback<Spec.TaxInvoiceSearchApiResponse>,
    error?: LegacyErrorCallback
  ): void
}

interface LegacyRegistIssueCallback {
  (corpNum: string, taxinvoice: Spec.TaxInvoiceApiModel): void
  (
    corpNum: string,
    taxinvoice: Spec.TaxInvoiceApiModel,
    success: LegacySuccessCallback<Spec.TaxInvoiceRegistIssueApiResponse>,
    error?: LegacyErrorCallback
  ): void
  (
    corpNum: string,
    taxinvoice: Spec.TaxInvoiceApiModel,
    userId: string,
    success: LegacySuccessCallback<Spec.TaxInvoiceRegistIssueApiResponse>,
    error?: LegacyErrorCallback
  ): void
  (
    corpNum: string,
    taxinvoice: Spec.TaxInvoiceApiModel,
    writeSpecification?: boolean,
    forceIssue?: boolean,
    memo?: string,
    emailSubject?: string,
    dealInvoiceMgtKey?: string,
    success?: LegacySuccessCallback<Spec.TaxInvoiceRegistIssueApiResponse>,
    error?: LegacyErrorCallback
  ): void
  (
    corpNum: string,
    taxinvoice: Spec.TaxInvoiceApiModel,
    writeSpecification: boolean,
    forceIssue: boolean,
    memo: string,
    emailSubject: string,
    dealInvoiceMgtKey: string,
    userId: string,
    success?: LegacySuccessCallback<Spec.TaxInvoiceRegistIssueApiResponse>,
    error?: LegacyErrorCallback
  ): void
}

interface LegacyBulkSubmitCallback {
  (corpNum: string, submitID: string, taxinvoiceList: Spec.TaxInvoiceApiModel[]): void
  (
    corpNum: string,
    submitID: string,
    taxinvoiceList: Spec.TaxInvoiceApiModel[],
    success: LegacySuccessCallback<Spec.TaxInvoiceBulkSubmitApiResponse>,
    error?: LegacyErrorCallback
  ): void
  (
    corpNum: string,
    submitID: string,
    taxinvoiceList: Spec.TaxInvoiceApiModel[],
    userId: string,
    success: LegacySuccessCallback<Spec.TaxInvoiceBulkSubmitApiResponse>,
    error?: LegacyErrorCallback
  ): void
  (
    corpNum: string,
    submitID: string,
    taxinvoiceList: Spec.TaxInvoiceApiModel[],
    forceIssue?: boolean,
    success?: LegacySuccessCallback<Spec.TaxInvoiceBulkSubmitApiResponse>,
    error?: LegacyErrorCallback
  ): void
  (
    corpNum: string,
    submitID: string,
    taxinvoiceList: Spec.TaxInvoiceApiModel[],
    forceIssue: boolean,
    userId: string,
    success?: LegacySuccessCallback<Spec.TaxInvoiceBulkSubmitApiResponse>,
    error?: LegacyErrorCallback
  ): void
}

/**
 * Callback 기반 legacy TaxinvoiceService 인터페이스.
 */
export interface TaxinvoiceCallbackService extends CallbackService {
  // ============================================================================
  // [발행/전송]
  // ============================================================================

  /**
   * 등록과 동시에 세금계산서를 즉시 발행합니다.
   */
  registIssue: LegacyRegistIssueCallback

  /**
   * 초대량 발행을 접수합니다.
   */
  bulkSubmit: LegacyBulkSubmitCallback

  /**
   * 초대량 발행 접수결과를 조회합니다.
   */
  getBulkResult: LegacyCallbackWithUserId<[corpNum: string, submitID: string], Spec.TaxInvoiceGetBulkResultApiResponse>

  /**
   * 세금계산서를 임시저장합니다.
   */
  register: LegacyCallbackWithUserId<[corpNum: string, taxinvoice: Spec.TaxInvoiceApiModel], Spec.TaxInvoiceApiResponseBase>

  /**
   * 임시저장 문서를 수정합니다.
   */
  update: LegacyCallbackWithUserId<
    [corpNum: string, keyType: TaxinvoiceOutboundDocumentKeyType, mgtKey: string, taxinvoice: Spec.TaxInvoiceApiModel],
    Spec.TaxInvoiceApiResponseBase
  >

  /**
   * 저장된 문서를 발행합니다.
   */
  issue: LegacyIssueCallback

  /**
   * 발행된 문서를 취소합니다.
   */
  cancelIssue: LegacyCallbackWithUserId<
    [corpNum: string, keyType: TaxinvoiceOutboundDocumentKeyType, mgtKey: string, memo: string],
    Spec.TaxInvoiceApiResponseBase
  >

  /**
   * 등록과 동시에 역발행 요청을 전송합니다.
   */
  registRequest: LegacyCallbackWithUserId<[corpNum: string, taxinvoice: Spec.TaxInvoiceApiModel, memo: string], Spec.TaxInvoiceApiResponseBase>

  /**
   * 저장된 문서로 역발행 요청을 전송합니다.
   */
  request: LegacyCallbackWithUserId<
    [corpNum: string, keyType: TaxinvoiceReverseRequestDocumentKeyType, mgtKey: string, memo: string],
    Spec.TaxInvoiceApiResponseBase
  >

  /**
   * 역발행 요청을 취소합니다.
   */
  cancelRequest: LegacyCallbackWithUserId<
    [corpNum: string, keyType: TaxinvoiceReverseRequestDocumentKeyType, mgtKey: string, memo: string],
    Spec.TaxInvoiceApiResponseBase
  >

  /**
   * 역발행 요청을 거부합니다.
   */
  refuse: LegacyCallbackWithUserId<
    [corpNum: string, keyType: TaxinvoiceReverseRefuseDocumentKeyType, mgtKey: string, memo: string],
    Spec.TaxInvoiceApiResponseBase
  >

  /**
   * 세금계산서를 삭제합니다.
   */
  delete: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxinvoiceDocumentKeyType, mgtKey: string], Spec.TaxInvoiceApiResponseBase>

  /**
   * 세금계산서를 국세청으로 즉시 전송합니다.
   */
  sendToNTS: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxinvoiceOutboundDocumentKeyType, mgtKey: string], Spec.TaxInvoiceApiResponseBase>

  // ============================================================================
  // [정보확인]
  // ============================================================================

  /**
   * 문서 1건의 상태/요약정보를 조회합니다.
   */
  getInfo: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxinvoiceDocumentKeyType, mgtKey: string], Spec.TaxInvoiceGetInfoApiResponse>

  /**
   * 문서 다건의 상태/요약정보를 조회합니다.
   */
  getInfos: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxinvoiceDocumentKeyType, mgtKeyList: string[]], Spec.TaxInvoiceGetInfosApiResponse>

  /**
   * 문서 1건의 상세정보를 조회합니다.
   */
  getDetailInfo: LegacyCallbackWithUserId<
    [corpNum: string, keyType: TaxinvoiceDocumentKeyType, mgtKey: string],
    Spec.TaxInvoiceGetDetailInfoApiResponse
  >

  /**
   * 문서번호 사용 여부를 확인합니다.
   */
  checkMgtKeyInUse: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxinvoiceDocumentKeyType, mgtKey: string], boolean>

  /**
   * 문서 1건의 XML 상세정보를 조회합니다.
   */
  getXML: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxinvoiceDocumentKeyType, mgtKey: string], Spec.TaxInvoiceGetXmlApiResponse>

  /**
   * 검색조건으로 문서 목록을 조회합니다.
   */
  search: LegacySearchCallback

  /**
   * 문서 상태 변경이력을 조회합니다.
   */
  getLogs: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxinvoiceDocumentKeyType, mgtKey: string], Spec.TaxInvoiceGetLogsApiResponse>

  /**
   * 세금계산서 문서함 팝업 URL을 조회합니다.
   */
  getURL: LegacyCallbackWithUserId<[corpNum: string, togo: TaxinvoiceBoxScope], string>

  // ============================================================================
  // [보기/인쇄]
  // ============================================================================

  /**
   * 문서 팝업 URL을 조회합니다.
   */
  getPopUpURL: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxinvoiceDocumentKeyType, mgtKey: string], string>

  /**
   * 문서 보기 전용 팝업 URL을 조회합니다.
   */
  getViewURL: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxinvoiceDocumentKeyType, mgtKey: string], string>

  /**
   * 공급자 인쇄 팝업 URL을 조회합니다.
   */
  getPrintURL: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxinvoiceDocumentKeyType, mgtKey: string], string>

  /**
   * 공급받는자 인쇄 팝업 URL을 조회합니다.
   */
  getEPrintURL: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxinvoiceDocumentKeyType, mgtKey: string], string>

  /**
   * 다건 인쇄 팝업 URL을 조회합니다.
   */
  getMassPrintURL: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxinvoiceDocumentKeyType, mgtKeyList: string[]], string>

  /**
   * 메일 보기 URL을 조회합니다.
   */
  getMailURL: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxinvoiceDocumentKeyType, mgtKey: string], string>

  /**
   * PDF 다운로드 URL을 조회합니다.
   */
  getPDFURL: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxinvoiceDocumentKeyType, mgtKey: string], string>

  // ============================================================================
  // [부가기능]
  // ============================================================================

  /**
   * 인감 및 첨부문서 등록 URL을 조회합니다.
   */
  getSealURL: LegacyCallbackWithUserId<[corpNum: string], Spec.TaxInvoiceGetSealUrlApiResponse>

  /**
   * 파일 경로로 첨부파일을 업로드합니다.
   */
  attachFile: LegacyCallbackWithUserId<
    [corpNum: string, keyType: TaxinvoiceDocumentKeyType, mgtKey: string, displayName: string, filePath: string],
    Spec.TaxInvoiceApiResponseBase
  >

  /**
   * 바이너리 데이터로 첨부파일을 업로드합니다.
   */
  attachFileBinary: LegacyCallbackWithUserId<
    [corpNum: string, keyType: TaxinvoiceDocumentKeyType, mgtKey: string, binaryFile: { fileName: string; fileData: Buffer }],
    Spec.TaxInvoiceApiResponseBase
  >

  /**
   * 첨부파일을 삭제합니다.
   */
  deleteFile: LegacyCallbackWithUserId<
    [corpNum: string, keyType: TaxinvoiceDocumentKeyType, mgtKey: string, fileID: string],
    Spec.TaxInvoiceApiResponseBase
  >

  /**
   * 첨부파일 목록을 조회합니다.
   */
  getFiles: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxinvoiceDocumentKeyType, mgtKey: string], Spec.TaxInvoiceGetFilesApiResponse>

  /**
   * 세금계산서 안내메일을 재전송합니다.
   */
  sendEmail: LegacyCallbackWithUserId<
    [corpNum: string, keyType: TaxinvoiceDocumentKeyType, mgtKey: string, receiver: string],
    Spec.TaxInvoiceApiResponseBase
  >

  /**
   * 세금계산서 안내문자를 재전송합니다.
   */
  sendSMS: LegacyCallbackWithUserId<
    [corpNum: string, keyType: TaxinvoiceDocumentKeyType, mgtKey: string, sender: string, receiver: string, contents: string],
    Spec.TaxInvoiceApiResponseBase
  >

  /**
   * 세금계산서 안내팩스를 재전송합니다.
   */
  sendFAX: LegacyCallbackWithUserId<
    [corpNum: string, keyType: TaxinvoiceDocumentKeyType, mgtKey: string, sender: string, receiver: string],
    Spec.TaxInvoiceApiResponseBase
  >

  /**
   * 전자명세서를 첨부합니다.
   */
  attachStatement: LegacyCallbackWithUserId<
    [corpNum: string, keyType: TaxinvoiceDocumentKeyType, mgtKey: string, subItemCode: number, subMgtKey: string],
    Spec.TaxInvoiceApiResponseBase
  >

  /**
   * 전자명세서 첨부를 해제합니다.
   */
  detachStatement: LegacyCallbackWithUserId<
    [corpNum: string, keyType: TaxinvoiceDocumentKeyType, mgtKey: string, subItemCode: number, subMgtKey: string],
    Spec.TaxInvoiceApiResponseBase
  >

  /**
   * 팝빌 문서 식별키에 문서번호를 할당합니다.
   */
  assignMgtKey: LegacyCallbackWithUserId<
    [corpNum: string, keyType: TaxinvoiceDocumentKeyType, itemKey: string, mgtKey: string],
    Spec.TaxInvoiceApiResponseBase
  >

  /**
   * 메일 전송설정 목록을 조회합니다.
   */
  listEmailConfig: LegacyCallbackWithUserId<[corpNum: string], Spec.TaxInvoiceListEmailConfigApiResponse>

  /**
   * 메일 전송설정을 수정합니다.
   */
  updateEmailConfig: LegacyCallbackWithUserId<[corpNum: string, emailType: string, sendYN: boolean], Spec.TaxInvoiceApiResponseBase>

  /**
   * 국세청 전송설정을 조회합니다.
   */
  getSendToNTSConfig: LegacyCallbackWithUserId<[corpNum: string], Spec.TaxInvoiceGetSendToNTSConfigApiResponse>

  // ============================================================================
  // [인증서 관리]
  // ============================================================================

  /**
   * 공동인증서 등록 URL을 조회합니다.
   */
  getTaxCertURL: LegacyCallbackWithUserId<[corpNum: string], Spec.TaxInvoiceGetTaxCertUrlApiResponse>

  /**
   * 공동인증서 만료일을 조회합니다.
   */
  getCertificateExpireDate: LegacyCallbackWithUserId<[corpNum: string], string>

  /**
   * 공동인증서 유효성을 확인합니다.
   */
  checkCertValidation: LegacyCallbackWithUserId<[corpNum: string], Spec.TaxInvoiceApiResponseBase>

  /**
   * 공동인증서 정보를 조회합니다.
   */
  getTaxCertInfo: LegacyCallbackWithUserId<[corpNum: string], Spec.TaxInvoiceGetTaxCertInfoApiResponse>

  // ============================================================================
  // [기타(legacy 호환)]
  // ============================================================================

  /**
   * 과금정보를 조회합니다. (legacy)
   */
  getChargeInfo: LegacyCallbackWithUserId<[corpNum: string], Spec.TaxInvoiceApiResponseBase>

  /**
   * 단가를 조회합니다. (legacy)
   */
  getUnitCost: LegacyCallbackWithUserId<[corpNum: string], number>

  /**
   * 발행안함 처리합니다. (legacy)
   */
  send: LegacySendCallback

  /**
   * 발행안함 처리를 취소합니다. (legacy)
   */
  cancelSend: LegacyCallbackWithUserId<
    [corpNum: string, keyType: TaxinvoiceDocumentKeyType, mgtKey: string, memo: string],
    Spec.TaxInvoiceApiResponseBase
  >

  /**
   * 역발행을 승인합니다. (legacy)
   */
  accept: LegacyCallbackWithUserId<
    [corpNum: string, keyType: TaxinvoiceDocumentKeyType, mgtKey: string, memo: string],
    Spec.TaxInvoiceApiResponseBase
  >

  /**
   * 역발행을 거부합니다. (legacy)
   */
  deny: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxinvoiceDocumentKeyType, mgtKey: string, memo: string], Spec.TaxInvoiceApiResponseBase>

  /**
   * 구버전 인쇄 팝업 URL을 조회합니다. (legacy)
   */
  getOldPrintURL: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxinvoiceDocumentKeyType, mgtKey: string], string>

  /**
   * 이메일 공개키를 조회합니다. (legacy)
   */
  getEmailPublicKeys: LegacyCallbackWithUserId<[corpNum: string], Spec.TaxInvoiceApiResponseBase>

  /**
   * PDF 바이너리를 조회합니다. (legacy)
   */
  getPDF: LegacyCallbackWithUserId<[corpNum: string, keyType: TaxinvoiceDocumentKeyType, mgtKey: string], Buffer>
}

/**
 * Promise 기반 legacy TaxinvoiceService 인터페이스.
 */
export interface TaxinvoicePromiseService extends PromiseService {
  // ============================================================================
  // [발행/전송]
  // ============================================================================

  /**
   * 등록과 동시에 세금계산서를 즉시 발행합니다.
   */
  registIssue(
    corpNum: string,
    taxinvoice: Spec.TaxInvoiceApiModel,
    writeSpecification?: boolean,
    forceIssue?: boolean,
    memo?: string,
    emailSubject?: string,
    dealInvoiceMgtKey?: string,
    userId?: string
  ): Promise<Spec.TaxInvoiceRegistIssueApiResponse>

  /**
   * 초대량 발행을 접수합니다.
   */
  bulkSubmit(
    corpNum: string,
    submitID: string,
    taxinvoiceList: Spec.TaxInvoiceApiModel[],
    forceIssue?: boolean,
    userId?: string
  ): Promise<Spec.TaxInvoiceBulkSubmitApiResponse>

  /**
   * 초대량 발행 접수결과를 조회합니다.
   */
  getBulkResult(corpNum: string, submitID: string, userId?: string): Promise<Spec.TaxInvoiceGetBulkResultApiResponse>

  /**
   * 세금계산서를 임시저장합니다.
   */
  register(corpNum: string, taxinvoice: Spec.TaxInvoiceApiModel, userId?: string): Promise<Spec.TaxInvoiceApiResponseBase>

  /**
   * 임시저장 문서를 수정합니다.
   */
  update(
    corpNum: string,
    keyType: TaxinvoiceOutboundDocumentKeyType,
    mgtKey: string,
    taxinvoice: Spec.TaxInvoiceApiModel,
    userId?: string
  ): Promise<Spec.TaxInvoiceApiResponseBase>

  /**
   * 저장된 문서를 발행합니다.
   */
  issue(
    corpNum: string,
    keyType: TaxinvoiceOutboundDocumentKeyType,
    mgtKey: string,
    memo: string,
    userId?: string
  ): Promise<Spec.TaxInvoiceIssueApiResponse>
  issue(
    corpNum: string,
    keyType: TaxinvoiceOutboundDocumentKeyType,
    mgtKey: string,
    memo: string,
    emailSubject: string | undefined,
    forceIssue: boolean | undefined,
    userId?: string
  ): Promise<Spec.TaxInvoiceIssueApiResponse>

  /**
   * 발행된 문서를 취소합니다.
   */
  cancelIssue(
    corpNum: string,
    keyType: TaxinvoiceOutboundDocumentKeyType,
    mgtKey: string,
    memo: string,
    userId?: string
  ): Promise<Spec.TaxInvoiceApiResponseBase>

  /**
   * 등록과 동시에 역발행 요청을 전송합니다.
   */
  registRequest(corpNum: string, taxinvoice: Spec.TaxInvoiceApiModel, memo: string, userId?: string): Promise<Spec.TaxInvoiceApiResponseBase>

  /**
   * 저장된 문서로 역발행 요청을 전송합니다.
   */
  request(
    corpNum: string,
    keyType: TaxinvoiceReverseRequestDocumentKeyType,
    mgtKey: string,
    memo: string,
    userId?: string
  ): Promise<Spec.TaxInvoiceApiResponseBase>

  /**
   * 역발행 요청을 취소합니다.
   */
  cancelRequest(
    corpNum: string,
    keyType: TaxinvoiceReverseRequestDocumentKeyType,
    mgtKey: string,
    memo: string,
    userId?: string
  ): Promise<Spec.TaxInvoiceApiResponseBase>

  /**
   * 역발행 요청을 거부합니다.
   */
  refuse(
    corpNum: string,
    keyType: TaxinvoiceReverseRefuseDocumentKeyType,
    mgtKey: string,
    memo: string,
    userId?: string
  ): Promise<Spec.TaxInvoiceApiResponseBase>

  /**
   * 세금계산서를 삭제합니다.
   */
  delete(corpNum: string, keyType: TaxinvoiceDocumentKeyType, mgtKey: string, userId?: string): Promise<Spec.TaxInvoiceApiResponseBase>

  /**
   * 세금계산서를 국세청으로 즉시 전송합니다.
   */
  sendToNTS(corpNum: string, keyType: TaxinvoiceOutboundDocumentKeyType, mgtKey: string, userId?: string): Promise<Spec.TaxInvoiceApiResponseBase>

  // ============================================================================
  // [정보확인]
  // ============================================================================

  /**
   * 문서 1건의 상태/요약정보를 조회합니다.
   */
  getInfo(corpNum: string, keyType: TaxinvoiceDocumentKeyType, mgtKey: string, userId?: string): Promise<Spec.TaxInvoiceGetInfoApiResponse>

  /**
   * 문서 다건의 상태/요약정보를 조회합니다.
   */
  getInfos(corpNum: string, keyType: TaxinvoiceDocumentKeyType, mgtKeyList: string[], userId?: string): Promise<Spec.TaxInvoiceGetInfosApiResponse>

  /**
   * 문서 1건의 상세정보를 조회합니다.
   */
  getDetailInfo(
    corpNum: string,
    keyType: TaxinvoiceDocumentKeyType,
    mgtKey: string,
    userId?: string
  ): Promise<Spec.TaxInvoiceGetDetailInfoApiResponse>

  /**
   * 문서번호 사용 여부를 확인합니다.
   */
  checkMgtKeyInUse(corpNum: string, keyType: TaxinvoiceDocumentKeyType, mgtKey: string, userId?: string): Promise<boolean>

  /**
   * 문서 1건의 XML 상세정보를 조회합니다.
   */
  getXML(corpNum: string, keyType: TaxinvoiceDocumentKeyType, mgtKey: string, userId?: string): Promise<Spec.TaxInvoiceGetXmlApiResponse>

  /**
   * 검색조건으로 문서 목록을 조회합니다.
   */
  search(
    corpNum: string,
    keyType: TaxinvoiceDocumentKeyType,
    dType: string,
    startDate: string,
    endDate: string,
    state: string[],
    type: string[],
    taxType: string[],
    lateOnly: boolean | null,
    order: string,
    page: number,
    perPage: number,
    taxRegIDType?: string,
    taxRegIDYN?: string,
    taxRegID?: string,
    qString?: string,
    interOPYN?: string,
    userId?: string,
    issueType?: string[],
    regType?: string[],
    closeDownState?: TaxinvoiceSearchCloseDownStateCode[],
    mgtKey?: string
  ): Promise<Spec.TaxInvoiceSearchApiResponse>

  /**
   * 문서 상태 변경이력을 조회합니다.
   */
  getLogs(corpNum: string, keyType: TaxinvoiceDocumentKeyType, mgtKey: string, userId?: string): Promise<Spec.TaxInvoiceGetLogsApiResponse>

  /**
   * 세금계산서 문서함 팝업 URL을 조회합니다.
   */
  getURL(corpNum: string, togo: TaxinvoiceBoxScope, userId?: string): Promise<string>

  // ============================================================================
  // [보기/인쇄]
  // ============================================================================

  /**
   * 문서 팝업 URL을 조회합니다.
   */
  getPopUpURL(corpNum: string, keyType: TaxinvoiceDocumentKeyType, mgtKey: string, userId?: string): Promise<string>

  /**
   * 문서 보기 전용 팝업 URL을 조회합니다.
   */
  getViewURL(corpNum: string, keyType: TaxinvoiceDocumentKeyType, mgtKey: string, userId?: string): Promise<string>

  /**
   * 공급자 인쇄 팝업 URL을 조회합니다.
   */
  getPrintURL(corpNum: string, keyType: TaxinvoiceDocumentKeyType, mgtKey: string, userId?: string): Promise<string>

  /**
   * 공급받는자 인쇄 팝업 URL을 조회합니다.
   */
  getEPrintURL(corpNum: string, keyType: TaxinvoiceDocumentKeyType, mgtKey: string, userId?: string): Promise<string>

  /**
   * 다건 인쇄 팝업 URL을 조회합니다.
   */
  getMassPrintURL(corpNum: string, keyType: TaxinvoiceDocumentKeyType, mgtKeyList: string[], userId?: string): Promise<string>

  /**
   * 메일 보기 URL을 조회합니다.
   */
  getMailURL(corpNum: string, keyType: TaxinvoiceDocumentKeyType, mgtKey: string, userId?: string): Promise<string>

  /**
   * PDF 다운로드 URL을 조회합니다.
   */
  getPDFURL(corpNum: string, keyType: TaxinvoiceDocumentKeyType, mgtKey: string, userId?: string): Promise<string>

  // ============================================================================
  // [부가기능]
  // ============================================================================

  /**
   * 인감 및 첨부문서 등록 URL을 조회합니다.
   */
  getSealURL(corpNum: string, userId?: string): Promise<Spec.TaxInvoiceGetSealUrlApiResponse>

  /**
   * 파일 경로로 첨부파일을 업로드합니다.
   */
  attachFile(
    corpNum: string,
    keyType: TaxinvoiceDocumentKeyType,
    mgtKey: string,
    displayName: string,
    filePath: string,
    userId?: string
  ): Promise<Spec.TaxInvoiceApiResponseBase>

  /**
   * 바이너리 데이터로 첨부파일을 업로드합니다.
   */
  attachFileBinary(
    corpNum: string,
    keyType: TaxinvoiceDocumentKeyType,
    mgtKey: string,
    binaryFile: { fileName: string; fileData: Buffer },
    userId?: string
  ): Promise<Spec.TaxInvoiceApiResponseBase>

  /**
   * 첨부파일을 삭제합니다.
   */
  deleteFile(
    corpNum: string,
    keyType: TaxinvoiceDocumentKeyType,
    mgtKey: string,
    fileID: string,
    userId?: string
  ): Promise<Spec.TaxInvoiceApiResponseBase>

  /**
   * 첨부파일 목록을 조회합니다.
   */
  getFiles(corpNum: string, keyType: TaxinvoiceDocumentKeyType, mgtKey: string, userId?: string): Promise<Spec.TaxInvoiceGetFilesApiResponse>

  /**
   * 세금계산서 안내메일을 재전송합니다.
   */
  sendEmail(
    corpNum: string,
    keyType: TaxinvoiceDocumentKeyType,
    mgtKey: string,
    receiver: string,
    userId?: string
  ): Promise<Spec.TaxInvoiceApiResponseBase>

  /**
   * 세금계산서 안내문자를 재전송합니다.
   */
  sendSMS(
    corpNum: string,
    keyType: TaxinvoiceDocumentKeyType,
    mgtKey: string,
    sender: string,
    receiver: string,
    contents: string,
    userId?: string
  ): Promise<Spec.TaxInvoiceApiResponseBase>

  /**
   * 세금계산서 안내팩스를 재전송합니다.
   */
  sendFAX(
    corpNum: string,
    keyType: TaxinvoiceDocumentKeyType,
    mgtKey: string,
    sender: string,
    receiver: string,
    userId?: string
  ): Promise<Spec.TaxInvoiceApiResponseBase>

  /**
   * 전자명세서를 첨부합니다.
   */
  attachStatement(
    corpNum: string,
    keyType: TaxinvoiceDocumentKeyType,
    mgtKey: string,
    subItemCode: number,
    subMgtKey: string,
    userId?: string
  ): Promise<Spec.TaxInvoiceApiResponseBase>

  /**
   * 전자명세서 첨부를 해제합니다.
   */
  detachStatement(
    corpNum: string,
    keyType: TaxinvoiceDocumentKeyType,
    mgtKey: string,
    subItemCode: number,
    subMgtKey: string,
    userId?: string
  ): Promise<Spec.TaxInvoiceApiResponseBase>

  /**
   * 팝빌 문서 식별키에 문서번호를 할당합니다.
   */
  assignMgtKey(
    corpNum: string,
    keyType: TaxinvoiceDocumentKeyType,
    itemKey: string,
    mgtKey: string,
    userId?: string
  ): Promise<Spec.TaxInvoiceApiResponseBase>

  /**
   * 메일 전송설정 목록을 조회합니다.
   */
  listEmailConfig(corpNum: string, userId?: string): Promise<Spec.TaxInvoiceListEmailConfigApiResponse>

  /**
   * 메일 전송설정을 수정합니다.
   */
  updateEmailConfig(corpNum: string, emailType: string, sendYN: boolean, userId?: string): Promise<Spec.TaxInvoiceApiResponseBase>

  /**
   * 국세청 전송설정을 조회합니다.
   */
  getSendToNTSConfig(corpNum: string, userId?: string): Promise<Spec.TaxInvoiceGetSendToNTSConfigApiResponse>

  // ============================================================================
  // [인증서 관리]
  // ============================================================================

  /**
   * 공동인증서 등록 URL을 조회합니다.
   */
  getTaxCertURL(corpNum: string, userId?: string): Promise<Spec.TaxInvoiceGetTaxCertUrlApiResponse>

  /**
   * 공동인증서 만료일을 조회합니다.
   */
  getCertificateExpireDate(corpNum: string, userId?: string): Promise<string>

  /**
   * 공동인증서 유효성을 확인합니다.
   */
  checkCertValidation(corpNum: string, userId?: string): Promise<Spec.TaxInvoiceApiResponseBase>

  /**
   * 공동인증서 정보를 조회합니다.
   */
  getTaxCertInfo(corpNum: string, userId?: string): Promise<Spec.TaxInvoiceGetTaxCertInfoApiResponse>

  // ============================================================================
  // [기타(legacy 호환)]
  // ============================================================================

  /**
   * 과금정보를 조회합니다. (legacy)
   */
  getChargeInfo(corpNum: string, userId?: string): Promise<Spec.TaxInvoiceApiResponseBase>

  /**
   * 단가를 조회합니다. (legacy)
   */
  getUnitCost(corpNum: string, userId?: string): Promise<number>

  /**
   * 발행안함 처리합니다. (legacy)
   */
  send(
    corpNum: string,
    keyType: TaxinvoiceDocumentKeyType,
    mgtKey: string,
    memo: string,
    emailSubject?: string,
    userId?: string
  ): Promise<Spec.TaxInvoiceApiResponseBase>

  /**
   * 발행안함 처리를 취소합니다. (legacy)
   */
  cancelSend(
    corpNum: string,
    keyType: TaxinvoiceDocumentKeyType,
    mgtKey: string,
    memo: string,
    userId?: string
  ): Promise<Spec.TaxInvoiceApiResponseBase>

  /**
   * 역발행을 승인합니다. (legacy)
   */
  accept(corpNum: string, keyType: TaxinvoiceDocumentKeyType, mgtKey: string, memo: string, userId?: string): Promise<Spec.TaxInvoiceApiResponseBase>

  /**
   * 역발행을 거부합니다. (legacy)
   */
  deny(corpNum: string, keyType: TaxinvoiceDocumentKeyType, mgtKey: string, memo: string, userId?: string): Promise<Spec.TaxInvoiceApiResponseBase>

  /**
   * 구버전 인쇄 팝업 URL을 조회합니다. (legacy)
   */
  getOldPrintURL(corpNum: string, keyType: TaxinvoiceDocumentKeyType, mgtKey: string, userId?: string): Promise<string>

  /**
   * 이메일 공개키를 조회합니다. (legacy)
   */
  getEmailPublicKeys(corpNum: string, userId?: string): Promise<Spec.TaxInvoiceApiResponseBase>

  /**
   * PDF 바이너리를 조회합니다. (legacy)
   */
  getPDF(corpNum: string, keyType: TaxinvoiceDocumentKeyType, mgtKey: string, userId?: string): Promise<Buffer>
}
