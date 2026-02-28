import type { TaxInvoiceApiRequest, TaxInvoiceMgtKeyType, TaxInvoiceRequireRequestFields } from '../common'

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
export type TaxInvoiceGetViewUrlApiRequest = TaxInvoiceRequireRequestFields<
  TaxInvoiceApiRequest<TaxInvoiceGetViewUrlApiRequestPath, TaxInvoiceGetViewUrlApiRequestQuery, TaxInvoiceGetViewUrlApiRequestBody>,
  'path' | 'query'
>

export interface TaxInvoiceGetViewUrlApiResponse {
  /**
   * 전자세금계산서 팝업 URL(보기 전용).
   */
  url: string
}
