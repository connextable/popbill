import type { TaxInvoiceApiRequest, TaxInvoiceRequireRequestFields } from '../common'
/**
 * TaxInvoice GetSealURL Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/etc#GetSealURL
 */

/**
 * GetSealURL API path 파라미터.
 */
export type TaxInvoiceGetSealUrlApiRequestPath = never

/**
 * GetSealURL API query 파라미터.
 */
export interface TaxInvoiceGetSealUrlApiRequestQuery {
  /**
   * 접근 메뉴 고정값.
   *
   * - `SEAL`: 인감 및 첨부문서 등록 팝업
   */
  TG: 'SEAL'
}

/**
 * GetSealURL API body.
 */
export type TaxInvoiceGetSealUrlApiRequestBody = never

/**
 * GetSealURL API 요청(raw).
 */
export type TaxInvoiceGetSealUrlApiRequest = TaxInvoiceRequireRequestFields<
  TaxInvoiceApiRequest<
    TaxInvoiceGetSealUrlApiRequestPath,
    TaxInvoiceGetSealUrlApiRequestQuery,
    TaxInvoiceGetSealUrlApiRequestBody
  >,
  'query'
>

export interface TaxInvoiceGetSealUrlApiResponse {
  /**
   * 인감 및 첨부문서 등록 팝업 URL.
   */
  url: string
}
