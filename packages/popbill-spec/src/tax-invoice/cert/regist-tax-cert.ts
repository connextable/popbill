import type { TaxInvoiceApiRequest, TaxInvoiceApiResponseBase, TaxInvoiceRequireRequestFields } from '../common'

/**
 * TaxInvoice RegistTaxCert Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/cert#RegistTaxCert
 */

/**
 * RegistTaxCert API path 파라미터.
 */
export type TaxInvoiceRegistTaxCertApiRequestPath = never

/**
 * RegistTaxCert API query 파라미터.
 */
export type TaxInvoiceRegistTaxCertApiRequestQuery = never

/**
 * RegistTaxCert API body(raw).
 */
export interface TaxInvoiceRegistTaxCertApiRequestBody {
  /**
   * 공동인증서 공개키.
   *
   * 필드 레벨 암호화(FLE)된 값으로 전달한다.
   */
  certPublicKey: string

  /**
   * 공동인증서 개인키.
   *
   * 필드 레벨 암호화(FLE)된 값으로 전달한다.
   */
  certPrivateKey: string

  /**
   * 공동인증서 비밀번호.
   *
   * 필드 레벨 암호화(FLE)된 값으로 전달한다.
   */
  certCipher: string
}

/**
 * RegistTaxCert API 요청(raw).
 */
export type TaxInvoiceRegistTaxCertApiRequest = TaxInvoiceRequireRequestFields<
  TaxInvoiceApiRequest<
    TaxInvoiceRegistTaxCertApiRequestPath,
    TaxInvoiceRegistTaxCertApiRequestQuery,
    TaxInvoiceRegistTaxCertApiRequestBody
  >,
  'body'
>

export type TaxInvoiceRegistTaxCertApiResponse = TaxInvoiceApiResponseBase
