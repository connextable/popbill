import type { TaxInvoiceApiRequest, TaxInvoiceMgtKeyType, TaxInvoiceRequireRequestFields } from '../common'

/**
 * TaxInvoice GetMassPrintURL Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/view#GetMassPrintURL
 */

/**
 * GetMassPrintURL API path 파라미터.
 */
export interface TaxInvoiceGetMassPrintUrlApiRequestPath {
  /**
   * 문서번호 유형.
   *
   * - `SELL`: 매출
   * - `BUY`: 매입
   * - `TRUSTEE`: 위수탁
   */
  MgtKeyType: TaxInvoiceMgtKeyType
}

/**
 * GetMassPrintURL API query 파라미터.
 */
export interface TaxInvoiceGetMassPrintUrlApiRequestQuery {
  /**
   * 다건 인쇄 옵션.
   *
   * `?Print` 형태로 빈값 파라미터를 전달한다.
   */
  Print: true
}

/**
 * 문서번호 목록.
 *
 * GetMassPrintURL API body(raw).
 *
 * 최대 100건까지 인쇄할 수 있다.
 */
export type TaxInvoiceGetMassPrintUrlApiRequestBody = string[]

/**
 * GetMassPrintURL API 요청(raw).
 */
export type TaxInvoiceGetMassPrintUrlApiRequest = TaxInvoiceRequireRequestFields<
  TaxInvoiceApiRequest<
    TaxInvoiceGetMassPrintUrlApiRequestPath,
    TaxInvoiceGetMassPrintUrlApiRequestQuery,
    TaxInvoiceGetMassPrintUrlApiRequestBody
  >,
  'path' | 'query' | 'body'
>

export interface TaxInvoiceGetMassPrintUrlApiResponse {
  /**
   * 전자세금계산서 다건 인쇄 팝업 URL.
   */
  url: string
}
