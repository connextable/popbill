import type { TaxInvoiceApiResponseBase } from '../common'

/**
 * TaxInvoice RegistTaxCert2 Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/cert#RegistTaxCertPFX
 */

/**
 * RegistTaxCert2 API path 파라미터.
 */
export type TaxInvoiceRegistTaxCert2ApiRequestPath = never

/**
 * RegistTaxCert2 API query 파라미터.
 */
export type TaxInvoiceRegistTaxCert2ApiRequestQuery = never

/**
 * RegistTaxCert2 API body(raw).
 */
export type TaxInvoiceRegistTaxCert2ApiRequestBody
  = | {
    /**
     * 공동인증서 PFX 파일.
     *
     * 필드 레벨 암호화(FLE)된 값으로 전달한다.
     */
    pfx: string

    /**
     * 공동인증서 PFX 파일 비밀번호.
     *
     * 필드 레벨 암호화(FLE)된 값으로 전달한다.
     */
    password: string
  }
  | {
    /**
     * 공동인증서 PFX 파일.
     *
     * @deprecated `pfx` 사용 권장.
     */
    certFilePath: string

    /**
     * 공동인증서 PFX 파일 비밀번호.
     *
     * @deprecated `password` 사용 권장.
     */
    certPassword: string
  }

/**
 * RegistTaxCert2 API 요청(raw).
 */
export interface TaxInvoiceRegistTaxCert2ApiRequest {
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

  path?: TaxInvoiceRegistTaxCert2ApiRequestPath

  query?: TaxInvoiceRegistTaxCert2ApiRequestQuery

  body: TaxInvoiceRegistTaxCert2ApiRequestBody
}

export type TaxInvoiceRegistTaxCert2ApiResponse = TaxInvoiceApiResponseBase
