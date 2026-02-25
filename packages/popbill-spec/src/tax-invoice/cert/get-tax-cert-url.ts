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
export interface TaxInvoiceGetTaxCertUrlApiRequest {
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

  path?: TaxInvoiceGetTaxCertUrlApiRequestPath

  query: TaxInvoiceGetTaxCertUrlApiRequestQuery

  body?: TaxInvoiceGetTaxCertUrlApiRequestBody
}

export interface TaxInvoiceGetTaxCertUrlApiResponse {
  /**
   * 인증서 등록 팝업 URL.
   */
  url: string
}
