import type { TaxInvoiceMgtKeyType } from '../common'

/**
 * TaxInvoice GetMailURL Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/view#GetMailURL
 */

/**
 * GetMailURL API path 파라미터.
 */
export interface TaxInvoiceGetMailUrlApiRequestPath {
  /**
   * 문서번호 유형.
   *
   * - `SELL`: 매출
   * - `BUY`: 매입
   * - `TRUSTEE`: 위수탁
   */
  MgtKeyType: TaxInvoiceMgtKeyType

  /**
   * 파트너가 할당한 문서번호.
   *
   * 최대 24자.
   */
  MgtKey: string
}

/**
 * GetMailURL API query 파라미터.
 */
export interface TaxInvoiceGetMailUrlApiRequestQuery {
  /**
   * 보기 타입 고정값.
   *
   * - `MAIL`: 메일 보기 팝업
   */
  TG: 'MAIL'
}

/**
 * GetMailURL API body.
 */
export type TaxInvoiceGetMailUrlApiRequestBody = never

/**
 * GetMailURL API 요청(raw).
 */
export interface TaxInvoiceGetMailUrlApiRequest {
  /**
   * 팝빌회원 사업자번호.
   *
   * `-` 없이 입력한다.
   */
  corpNum: string

  /**
   * 팝빌회원 아이디.
   */
  userId?: string

  path: TaxInvoiceGetMailUrlApiRequestPath

  query: TaxInvoiceGetMailUrlApiRequestQuery

  body?: TaxInvoiceGetMailUrlApiRequestBody
}

export interface TaxInvoiceGetMailUrlApiResponse {
  /**
   * 전자세금계산서 메일 보기 팝업 URL.
   */
  url: string
}
