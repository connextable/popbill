import type { TaxInvoiceMgtKeyType } from '../common'

/**
 * TaxInvoice GetPopUpURL Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/view#GetPopUpURL
 */

/**
 * GetPopUpURL API path 파라미터.
 */
export interface TaxInvoiceGetPopUpUrlApiRequestPath {
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
 * GetPopUpURL API query 파라미터.
 */
export interface TaxInvoiceGetPopUpUrlApiRequestQuery {
  /**
   * 보기 타입 고정값.
   *
   * - `POPUP`: 전자세금계산서 팝업
   */
  TG: 'POPUP'
}

/**
 * GetPopUpURL API body.
 */
export type TaxInvoiceGetPopUpUrlApiRequestBody = never

/**
 * GetPopUpURL API 요청(raw).
 */
export interface TaxInvoiceGetPopUpUrlApiRequest {
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

  path: TaxInvoiceGetPopUpUrlApiRequestPath

  query: TaxInvoiceGetPopUpUrlApiRequestQuery

  body?: TaxInvoiceGetPopUpUrlApiRequestBody
}

export interface TaxInvoiceGetPopUpUrlApiResponse {
  /**
   * 전자세금계산서 팝업 URL.
   */
  url: string
}
