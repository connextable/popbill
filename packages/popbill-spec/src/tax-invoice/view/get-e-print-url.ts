import type { TaxInvoiceMgtKeyType } from '../common'

/**
 * TaxInvoice GetEPrintURL Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/view#GetEPrintURL
 */

/**
 * GetEPrintURL API path 파라미터.
 */
export interface TaxInvoiceGetEPrintUrlApiRequestPath {
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
 * GetEPrintURL API query 파라미터.
 */
export interface TaxInvoiceGetEPrintUrlApiRequestQuery {
  /**
   * 보기 타입 고정값.
   *
   * - `EPRINT`: 공급받는자 인쇄 팝업
   */
  TG: 'EPRINT'
}

/**
 * GetEPrintURL API body.
 */
export type TaxInvoiceGetEPrintUrlApiRequestBody = never

/**
 * GetEPrintURL API 요청(raw).
 */
export interface TaxInvoiceGetEPrintUrlApiRequest {
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

  path: TaxInvoiceGetEPrintUrlApiRequestPath

  query: TaxInvoiceGetEPrintUrlApiRequestQuery

  body?: TaxInvoiceGetEPrintUrlApiRequestBody
}

export interface TaxInvoiceGetEPrintUrlApiResponse {
  /**
   * 전자세금계산서 공급받는자 인쇄 팝업 URL.
   */
  url: string
}
