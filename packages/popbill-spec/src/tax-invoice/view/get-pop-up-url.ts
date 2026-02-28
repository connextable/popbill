import type { TaxInvoiceApiRequest, TaxInvoiceMgtKeyType, TaxInvoiceRequireRequestFields } from '../common'

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
export type TaxInvoiceGetPopUpUrlApiRequest = TaxInvoiceRequireRequestFields<
  TaxInvoiceApiRequest<TaxInvoiceGetPopUpUrlApiRequestPath, TaxInvoiceGetPopUpUrlApiRequestQuery, TaxInvoiceGetPopUpUrlApiRequestBody>,
  'path' | 'query'
>

export interface TaxInvoiceGetPopUpUrlApiResponse {
  /**
   * 전자세금계산서 팝업 URL.
   */
  url: string
}
