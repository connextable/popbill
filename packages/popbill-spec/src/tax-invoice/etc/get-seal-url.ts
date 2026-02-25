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
export interface TaxInvoiceGetSealUrlApiRequest {
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

  path?: TaxInvoiceGetSealUrlApiRequestPath

  query: TaxInvoiceGetSealUrlApiRequestQuery

  body?: TaxInvoiceGetSealUrlApiRequestBody
}

export interface TaxInvoiceGetSealUrlApiResponse {
  /**
   * 인감 및 첨부문서 등록 팝업 URL.
   */
  url: string
}
