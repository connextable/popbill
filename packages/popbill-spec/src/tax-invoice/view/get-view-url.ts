import type { TaxInvoiceMgtKeyType } from '../common'

/**
 * TaxInvoice GetViewURL Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/view#GetViewURL
 */

/**
 * GetViewURL API path 파라미터.
 */
export interface TaxInvoiceGetViewUrlApiRequestPath {
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
 * GetViewURL API query 파라미터.
 */
export interface TaxInvoiceGetViewUrlApiRequestQuery {
  /**
   * 보기 타입 고정값.
   *
   * - `VIEW`: 보기 전용 팝업
   */
  TG: 'VIEW'
}

/**
 * GetViewURL API body.
 */
export type TaxInvoiceGetViewUrlApiRequestBody = never

/**
 * GetViewURL API 요청(raw).
 */
export interface TaxInvoiceGetViewUrlApiRequest {
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

  path: TaxInvoiceGetViewUrlApiRequestPath

  query: TaxInvoiceGetViewUrlApiRequestQuery

  body?: TaxInvoiceGetViewUrlApiRequestBody
}

export interface TaxInvoiceGetViewUrlApiResponse {
  /**
   * 전자세금계산서 팝업 URL(보기 전용).
   */
  url: string
}
