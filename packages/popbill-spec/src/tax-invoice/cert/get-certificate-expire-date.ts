/**
 * TaxInvoice GetCertificateExpireDate Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/cert#GetCertificateExpireDate
 */

/**
 * GetCertificateExpireDate API path 파라미터.
 */
export type TaxInvoiceGetCertificateExpireDateApiRequestPath = never

/**
 * GetCertificateExpireDate API query 파라미터.
 */
export interface TaxInvoiceGetCertificateExpireDateApiRequestQuery {
  /**
   * 조회 설정 고정값.
   *
   * - `CERT`: 인증서 만료일 조회
   */
  cfg: 'CERT'
}

/**
 * GetCertificateExpireDate API body.
 */
export type TaxInvoiceGetCertificateExpireDateApiRequestBody = never

/**
 * GetCertificateExpireDate API 요청(raw).
 */
export interface TaxInvoiceGetCertificateExpireDateApiRequest {
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

  path?: TaxInvoiceGetCertificateExpireDateApiRequestPath

  query: TaxInvoiceGetCertificateExpireDateApiRequestQuery

  body?: TaxInvoiceGetCertificateExpireDateApiRequestBody
}

export interface TaxInvoiceGetCertificateExpireDateApiResponse {
  /**
   * 공동인증서 만료일시.
   *
   * `yyyyMMddHHmmss` 형식.
   */
  certificateExpiration: string
}
