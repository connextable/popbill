import type { TaxInvoiceApiRequest, TaxInvoiceMgtKeyType, TaxInvoiceRequireRequestFields } from '../common'

/**
 * TaxInvoice GetPrintURL Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/view#GetPrintURL
 */

/**
 * GetPrintURL API path 파라미터.
 */
export interface TaxInvoiceGetPrintUrlApiRequestPath {
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
 * GetPrintURL API query 파라미터.
 */
export interface TaxInvoiceGetPrintUrlApiRequestQuery {
  /**
   * 보기 타입 고정값.
   *
   * - `PRINT`: 공급자 인쇄 팝업
   */
  TG: 'PRINT'
}

/**
 * GetPrintURL API body.
 */
export type TaxInvoiceGetPrintUrlApiRequestBody = never

/**
 * GetPrintURL API 요청(raw).
 */
export type TaxInvoiceGetPrintUrlApiRequest = TaxInvoiceRequireRequestFields<
  TaxInvoiceApiRequest<
    TaxInvoiceGetPrintUrlApiRequestPath,
    TaxInvoiceGetPrintUrlApiRequestQuery,
    TaxInvoiceGetPrintUrlApiRequestBody
  >,
  'path' | 'query'
>

export interface TaxInvoiceGetPrintUrlApiResponse {
  /**
   * 전자세금계산서 공급자 인쇄 팝업 URL.
   */
  url: string
}
