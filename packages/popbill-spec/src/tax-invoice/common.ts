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
export type TaxInvoiceMgtKeyType = 'SELL' | 'BUY' | 'TRUSTEE'

/**
 * 문서번호 유형(raw).
 *
 * @deprecated `TaxInvoiceMgtKeyType` 사용 권장.
 */
export type TaxInvoiceKeyType = TaxInvoiceMgtKeyType

/**
 * 과세 형태(raw).
 *
 * - `과세`: 일반 과세
 * - `영세`: 영세율
 * - `면세`: 면세
 */
export type TaxType = '과세' | '영세' | '면세'

/**
 * 발행 형태(raw).
 *
 * - `정발행`: 공급자 중심 발행
 * - `역발행`: 공급받는자 요청 기반 발행
 * - `위수탁`: 수탁자 대행 발행
 */
export type IssueType = '정발행' | '역발행' | '위수탁'

/**
 * 영수/청구 유형(raw).
 *
 * - `영수`: 영수 목적
 * - `청구`: 청구 목적
 * - `없음`: 구분 없음
 */
export type PurposeType = '영수' | '청구' | '없음'

/**
 * 공급받는자 유형(raw).
 *
 * - `사업자`: 사업자 등록번호 기준
 * - `개인`: 주민등록번호 기준
 * - `외국인`: 외국인 식별번호 기준
 */
export type InvoiceeType = '사업자' | '개인' | '외국인'

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
export type CloseDownState = 0 | 1 | 2 | 3 | 4 | null

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
export type TaxInvoiceSearchCloseDownState = 'N' | '0' | '1' | '2' | '3' | '4'

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
export type TaxInvoiceDateType = 'R' | 'W' | 'I'

/**
 * 정렬 방향(raw).
 *
 * - `D`: 내림차순
 * - `A`: 오름차순
 */
export type TaxInvoiceSortOrder = 'D' | 'A'

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
export type TaxInvoiceEmailType = 'ETC_CERT_EXPIRATION' | 'TAX_CANCEL_ISSUE' | 'TAX_CANCEL_REQUEST' | 'TAX_CHECK' | 'TAX_CLOSEDOWN' | 'TAX_ISSUE' | 'TAX_ISSUE_INVOICER' | 'TAX_NTSFAIL_INVOICER' | 'TAX_REFUSE' | 'TAX_REQUEST' | 'TAX_REVERSE_ISSUE' | 'TAX_TRUST_CANCEL_ISSUE' | 'TAX_TRUST_CANCEL_ISSUE_INVOICER' | 'TAX_TRUST_ISSUE' | 'TAX_TRUST_ISSUE_INVOICER' | 'TAX_TRUST_ISSUE_TRUSTEE' | 'TAX_ACCEPT' | 'TAX_DENY' | 'TAX_CANCEL_SEND'

/**
 * 작성일/일시 문자열(raw).
 */
export type TaxInvoiceDateString = string
