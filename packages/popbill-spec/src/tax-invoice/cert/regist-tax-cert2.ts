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
 * RegistTaxCert2 API body - FLE 필드명(raw).
 */
export interface TaxInvoiceRegistTaxCert2ApiRequestBodyFLE {
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
 * RegistTaxCert2 API body - legacy 필드명(raw).
 */
export interface TaxInvoiceRegistTaxCert2ApiRequestBodyLegacy {
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
 * RegistTaxCert2 API body 타입 매핑(raw).
 */
export interface TaxInvoiceRegistTaxCert2ApiRequestBodyMap {
  /**
   * FLE 필드명 형식.
   */
  Fle: TaxInvoiceRegistTaxCert2ApiRequestBodyFLE

  /**
   * legacy 필드명 형식.
   */
  Legacy: TaxInvoiceRegistTaxCert2ApiRequestBodyLegacy
}

/**
 * RegistTaxCert2 API body(raw).
 */
export type TaxInvoiceRegistTaxCert2ApiRequestBody
  = TaxInvoiceRegistTaxCert2ApiRequestBodyMap[keyof TaxInvoiceRegistTaxCert2ApiRequestBodyMap]

/**
 * RegistTaxCert2 API 요청(raw).
 */
export type TaxInvoiceRegistTaxCert2ApiRequest = TaxInvoiceRequireRequestFields<
  TaxInvoiceApiRequest<
    TaxInvoiceRegistTaxCert2ApiRequestPath,
    TaxInvoiceRegistTaxCert2ApiRequestQuery,
    TaxInvoiceRegistTaxCert2ApiRequestBody
  >,
  'body'
>

export type TaxInvoiceRegistTaxCert2ApiResponse = TaxInvoiceApiResponseBase
