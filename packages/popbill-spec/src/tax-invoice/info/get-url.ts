import type { TaxInvoiceApiRequest, TaxInvoiceRequireRequestFields } from '../common'

/**
 * TaxInvoice GetURL Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/info#GetURL
 */

/**
 * GetURL API path 파라미터.
 */
export type TaxInvoiceGetUrlApiRequestPath = never

/**
 * GetURL 접근 메뉴(raw).
 */
export type TaxInvoiceGetUrlTogo = 'TBOX' | 'SWBOX' | 'SBOX' | 'PWBOX' | 'PBOX' | 'WRITE'

/**
 * GetURL API query 파라미터.
 */
export interface TaxInvoiceGetUrlApiRequestQuery {
  /**
   * 접근 메뉴.
   */
  TG: TaxInvoiceGetUrlTogo
}

/**
 * GetURL API body.
 */
export type TaxInvoiceGetUrlApiRequestBody = never

/**
 * GetURL API 요청(raw).
 */
export type TaxInvoiceGetUrlApiRequest = TaxInvoiceRequireRequestFields<
  TaxInvoiceApiRequest<TaxInvoiceGetUrlApiRequestPath, TaxInvoiceGetUrlApiRequestQuery, TaxInvoiceGetUrlApiRequestBody>,
  'query'
>

export interface TaxInvoiceGetUrlApiResponse {
  /**
   * 전자세금계산서 문서함 팝업 URL.
   */
  url: string
}
