import type { TaxInvoiceApiRequest, TaxInvoiceApiResponseBase, TaxInvoiceRequireRequestFields } from '../common'

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
export interface TaxInvoiceRegistTaxCert2ApiRequestBody {
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

/**
 * RegistTaxCert2 API 요청(raw).
 */
export type TaxInvoiceRegistTaxCert2ApiRequest = TaxInvoiceRequireRequestFields<
  TaxInvoiceApiRequest<TaxInvoiceRegistTaxCert2ApiRequestPath, TaxInvoiceRegistTaxCert2ApiRequestQuery, TaxInvoiceRegistTaxCert2ApiRequestBody>,
  'body'
>

export type TaxInvoiceRegistTaxCert2ApiResponse = TaxInvoiceApiResponseBase
