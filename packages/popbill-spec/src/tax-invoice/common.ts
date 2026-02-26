import type { PopbillApiRequestHeaders, PopbillBulkIssueRequestHeaders } from '../headers'
import type { PopbillApiRequest, PopbillRequireRequestFields } from '../request'

/**
 * Tax Invoice Common Raw Types
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/info
 * - https://developers.popbill.com/api-reference/taxinvoice/api/issue
 * - https://developers.popbill.com/api-reference/taxinvoice/api/etc
 * - https://developers.popbill.com/api-reference/taxinvoice/api/cert
 * - https://developers.popbill.com/api-reference/taxinvoice/response-code
 */

/**
 * Taxinvoice 공통 요청 헤더(raw).
 *
 * Source
 * - https://developers.popbill.com/api-reference/cashbill/getting-started/authorization
 * - https://developers.popbill.com/api-reference/cashbill/getting-started/etc-header
 */
export type TaxInvoiceApiRequestHeaders = PopbillApiRequestHeaders

/**
 * Taxinvoice 대량발행(Bulk) 요청 헤더(raw).
 */
export type TaxInvoiceBulkIssueRequestHeaders = PopbillBulkIssueRequestHeaders

/**
 * Taxinvoice 공통 요청(raw).
 */
export type TaxInvoiceApiRequest<
  TPath = never,
  TQuery = never,
  TBody = never,
  THeaders = TaxInvoiceApiRequestHeaders,
> = PopbillApiRequest<TPath, TQuery, TBody, THeaders>

/**
 * Taxinvoice 요청 타입의 특정 필드를 필수화하는 유틸리티 타입.
 */
export type TaxInvoiceRequireRequestFields<T, K extends keyof T> = PopbillRequireRequestFields<T, K>

/**
 * Taxinvoice API 공통 처리결과(raw).
 */
export interface TaxInvoiceApiResponseBase {
  /**
   * 처리 결과코드.
   */
  code: number

  /**
   * 처리 결과메시지.
   */
  message: string
}

/**
 * 문서번호 유형(raw).
 *
 * - `SELL`: 매출
 * - `BUY`: 매입
 * - `TRUSTEE`: 위수탁
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/info#Search
 */
export interface TaxInvoiceMgtKeyTypeMap {
  /**
   * 매출 문서번호 유형.
   */
  Sell: 'SELL'

  /**
   * 매입 문서번호 유형.
   */
  Buy: 'BUY'

  /**
   * 위수탁 문서번호 유형.
   */
  Trustee: 'TRUSTEE'
}

/**
 * 문서번호 유형(raw).
 */
export type TaxInvoiceMgtKeyType = TaxInvoiceMgtKeyTypeMap[keyof TaxInvoiceMgtKeyTypeMap]

/**
 * 과세 형태(raw).
 *
 * - `과세`: 일반 과세
 * - `영세`: 영세율
 * - `면세`: 면세
 */
export interface TaxTypeMap {
  /**
   * 일반 과세.
   */
  Taxable: '과세'

  /**
   * 영세율.
   */
  ZeroRated: '영세'

  /**
   * 면세.
   */
  Exempt: '면세'
}

/**
 * 과세 형태(raw).
 */
export type TaxType = TaxTypeMap[keyof TaxTypeMap]

/**
 * 발행 형태(raw).
 *
 * - `정발행`: 공급자 중심 발행
 * - `역발행`: 공급받는자 요청 기반 발행
 * - `위수탁`: 수탁자 대행 발행
 */
export interface IssueTypeMap {
  /**
   * 정발행.
   */
  Normal: '정발행'

  /**
   * 역발행.
   */
  Reverse: '역발행'

  /**
   * 위수탁 발행.
   */
  Trustee: '위수탁'
}

/**
 * 발행 형태(raw).
 */
export type IssueType = IssueTypeMap[keyof IssueTypeMap]

/**
 * 영수/청구 유형(raw).
 *
 * - `영수`: 영수 목적
 * - `청구`: 청구 목적
 * - `없음`: 구분 없음
 */
export interface PurposeTypeMap {
  /**
   * 영수 목적.
   */
  Receipt: '영수'

  /**
   * 청구 목적.
   */
  Claim: '청구'

  /**
   * 구분 없음.
   */
  None: '없음'
}

/**
 * 영수/청구 유형(raw).
 */
export type PurposeType = PurposeTypeMap[keyof PurposeTypeMap]

/**
 * 공급받는자 유형(raw).
 *
 * - `사업자`: 사업자 등록번호 기준
 * - `개인`: 주민등록번호 기준
 * - `외국인`: 외국인 식별번호 기준
 */
export interface InvoiceeTypeMap {
  /**
   * 사업자.
   */
  Corporation: '사업자'

  /**
   * 개인.
   */
  Individual: '개인'

  /**
   * 외국인.
   */
  Foreigner: '외국인'
}

/**
 * 공급받는자 유형(raw).
 */
export type InvoiceeType = InvoiceeTypeMap[keyof InvoiceeTypeMap]

/**
 * 휴폐업 상태(raw).
 *
 * - `null`: 미확인
 * - `0`: 미등록
 * - `1`: 사업중
 * - `2`: 폐업
 * - `3`: 휴업
 * - `4`: 확인실패
 */
export interface CloseDownStateMap {
  /**
   * 미확인.
   */
  NotChecked: null

  /**
   * 미등록.
   */
  NotRegistered: 0

  /**
   * 사업중.
   */
  Operating: 1

  /**
   * 폐업.
   */
  Closed: 2

  /**
   * 휴업.
   */
  Suspended: 3

  /**
   * 확인실패.
   */
  CheckFailed: 4
}

/**
 * 휴폐업 상태(raw).
 */
export type CloseDownState = CloseDownStateMap[keyof CloseDownStateMap]

/**
 * Search API 휴폐업상태 필터(raw).
 *
 * - `N`: 미확인
 * - `0`: 미등록
 * - `1`: 사업중
 * - `2`: 폐업
 * - `3`: 휴업
 * - `4`: 확인실패
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/info#Search
 */
export interface TaxInvoiceSearchCloseDownStateMap {
  /**
   * 미확인.
   */
  NotChecked: 'N'

  /**
   * 미등록.
   */
  NotRegistered: '0'

  /**
   * 사업중.
   */
  Operating: '1'

  /**
   * 폐업.
   */
  Closed: '2'

  /**
   * 휴업.
   */
  Suspended: '3'

  /**
   * 확인실패.
   */
  CheckFailed: '4'
}

/**
 * Search API 휴폐업상태 필터(raw).
 */
export type TaxInvoiceSearchCloseDownState = TaxInvoiceSearchCloseDownStateMap[keyof TaxInvoiceSearchCloseDownStateMap]

/**
 * 검색일자 유형(raw).
 *
 * - `R`: 등록일자
 * - `W`: 작성일자
 * - `I`: 발행일자
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/info#Search
 */
export interface TaxInvoiceDateTypeMap {
  /**
   * 등록일자.
   */
  Registered: 'R'

  /**
   * 작성일자.
   */
  Written: 'W'

  /**
   * 발행일자.
   */
  Issued: 'I'
}

/**
 * 검색일자 유형(raw).
 */
export type TaxInvoiceDateType = TaxInvoiceDateTypeMap[keyof TaxInvoiceDateTypeMap]

/**
 * 정렬 방향(raw).
 *
 * - `D`: 내림차순
 * - `A`: 오름차순
 */
export interface TaxInvoiceSortOrderMap {
  /**
   * 내림차순.
   */
  Descending: 'D'

  /**
   * 오름차순.
   */
  Ascending: 'A'
}

/**
 * 정렬 방향(raw).
 */
export type TaxInvoiceSortOrder = TaxInvoiceSortOrderMap[keyof TaxInvoiceSortOrderMap]

/**
 * 이메일 설정 구분(raw).
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/etc#UpdateEmailConfig
 *
 * 문서/legacy 공통 사용값:
 * - `ETC_CERT_EXPIRATION`: 인증서 만료 안내
 * - `TAX_CANCEL_ISSUE`: 발행취소
 * - `TAX_CANCEL_REQUEST`: 역발행 요청 취소
 * - `TAX_CHECK`: 수신확인
 * - `TAX_CLOSEDOWN`: 휴폐업 알림
 * - `TAX_ISSUE`: 발행완료(수신자)
 * - `TAX_ISSUE_INVOICER`: 발행완료(공급자)
 * - `TAX_NTSFAIL_INVOICER`: 국세청 전송실패(공급자)
 * - `TAX_REFUSE`: 역발행 거부
 * - `TAX_REQUEST`: 역발행 요청
 * - `TAX_REVERSE_ISSUE`: 역발행 완료
 * - `TAX_TRUST_CANCEL_ISSUE`: 위수탁 발행취소
 * - `TAX_TRUST_CANCEL_ISSUE_INVOICER`: 위수탁 발행취소(공급자)
 * - `TAX_TRUST_ISSUE`: 위수탁 발행완료
 * - `TAX_TRUST_ISSUE_INVOICER`: 위수탁 발행완료(공급자)
 * - `TAX_TRUST_ISSUE_TRUSTEE`: 위수탁 발행완료(수탁자)
 * - `TAX_ACCEPT`: 역발행 승인(legacy)
 * - `TAX_DENY`: 역발행 거부(legacy)
 * - `TAX_CANCEL_SEND`: 발행안함 취소(legacy)
 */
export interface TaxInvoiceEmailTypeMap {
  /**
   * 인증서 만료 안내.
   */
  EtcCertExpiration: 'ETC_CERT_EXPIRATION'

  /**
   * 발행취소.
   */
  TaxCancelIssue: 'TAX_CANCEL_ISSUE'

  /**
   * 역발행 요청 취소.
   */
  TaxCancelRequest: 'TAX_CANCEL_REQUEST'

  /**
   * 수신확인.
   */
  TaxCheck: 'TAX_CHECK'

  /**
   * 휴폐업 알림.
   */
  TaxClosedown: 'TAX_CLOSEDOWN'

  /**
   * 발행완료(수신자).
   */
  TaxIssue: 'TAX_ISSUE'

  /**
   * 발행완료(공급자).
   */
  TaxIssueInvoicer: 'TAX_ISSUE_INVOICER'

  /**
   * 국세청 전송실패(공급자).
   */
  TaxNtsFailInvoicer: 'TAX_NTSFAIL_INVOICER'

  /**
   * 역발행 거부.
   */
  TaxRefuse: 'TAX_REFUSE'

  /**
   * 역발행 요청.
   */
  TaxRequest: 'TAX_REQUEST'

  /**
   * 역발행 완료.
   */
  TaxReverseIssue: 'TAX_REVERSE_ISSUE'

  /**
   * 위수탁 발행취소.
   */
  TaxTrustCancelIssue: 'TAX_TRUST_CANCEL_ISSUE'

  /**
   * 위수탁 발행취소(공급자).
   */
  TaxTrustCancelIssueInvoicer: 'TAX_TRUST_CANCEL_ISSUE_INVOICER'

  /**
   * 위수탁 발행완료.
   */
  TaxTrustIssue: 'TAX_TRUST_ISSUE'

  /**
   * 위수탁 발행완료(공급자).
   */
  TaxTrustIssueInvoicer: 'TAX_TRUST_ISSUE_INVOICER'

  /**
   * 위수탁 발행완료(수탁자).
   */
  TaxTrustIssueTrustee: 'TAX_TRUST_ISSUE_TRUSTEE'

  /**
   * 역발행 승인(legacy).
   */
  TaxAccept: 'TAX_ACCEPT'

  /**
   * 역발행 거부(legacy).
   */
  TaxDeny: 'TAX_DENY'

  /**
   * 발행안함 취소(legacy).
   */
  TaxCancelSend: 'TAX_CANCEL_SEND'
}

/**
 * 이메일 설정 구분(raw).
 */
export type TaxInvoiceEmailType = TaxInvoiceEmailTypeMap[keyof TaxInvoiceEmailTypeMap]

/**
 * 작성일/일시 문자열(raw).
 */
export type TaxInvoiceDateString = string
