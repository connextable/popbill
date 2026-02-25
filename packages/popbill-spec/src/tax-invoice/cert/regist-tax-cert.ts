import type { TaxInvoiceApiResponseBase } from '../common'

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
export interface TaxInvoiceRegistTaxCertApiRequest {
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

  path?: TaxInvoiceRegistTaxCertApiRequestPath

  query?: TaxInvoiceRegistTaxCertApiRequestQuery

  body: TaxInvoiceRegistTaxCertApiRequestBody
}

export type TaxInvoiceRegistTaxCertApiResponse = TaxInvoiceApiResponseBase
