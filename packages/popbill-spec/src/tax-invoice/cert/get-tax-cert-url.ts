import type { TaxInvoiceApiRequest, TaxInvoiceRequireRequestFields } from '../common'
/**
 * TaxInvoice GetTaxCertURL Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/cert#GetTaxCertURL
 */

/**
 * GetTaxCertURL API path 파라미터.
 */
export type TaxInvoiceGetTaxCertUrlApiRequestPath = never

/**
 * GetTaxCertURL API query 파라미터.
 */
export interface TaxInvoiceGetTaxCertUrlApiRequestQuery {
  /**
   * 접근 메뉴 고정값.
   *
   * - `CERT`: 인증서 등록 팝업
   */
  TG: 'CERT'
}

/**
 * GetTaxCertURL API body.
 */
export type TaxInvoiceGetTaxCertUrlApiRequestBody = never

/**
 * GetTaxCertURL API 요청(raw).
 */
export type TaxInvoiceGetTaxCertUrlApiRequest = TaxInvoiceRequireRequestFields<
  TaxInvoiceApiRequest<
    TaxInvoiceGetTaxCertUrlApiRequestPath,
    TaxInvoiceGetTaxCertUrlApiRequestQuery,
    TaxInvoiceGetTaxCertUrlApiRequestBody
  >,
  'query'
>

export interface TaxInvoiceGetTaxCertUrlApiResponse {
  /**
   * 인증서 등록 팝업 URL.
   */
  url: string
}
