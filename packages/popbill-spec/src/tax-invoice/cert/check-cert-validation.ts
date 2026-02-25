import type { TaxInvoiceApiResponseBase } from '../common'

/**
 * TaxInvoice CheckCertValidation Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/cert#CheckCertValidation
 */

/**
 * CheckCertValidation API path 파라미터.
 */
export type TaxInvoiceCheckCertValidationApiRequestPath = never

/**
 * CheckCertValidation API query 파라미터.
 */
export type TaxInvoiceCheckCertValidationApiRequestQuery = never

/**
 * CheckCertValidation API body.
 */
export type TaxInvoiceCheckCertValidationApiRequestBody = never

/**
 * CheckCertValidation API 요청(raw).
 */
export interface TaxInvoiceCheckCertValidationApiRequest {
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

  path?: TaxInvoiceCheckCertValidationApiRequestPath

  query?: TaxInvoiceCheckCertValidationApiRequestQuery

  body?: TaxInvoiceCheckCertValidationApiRequestBody
}

export type TaxInvoiceCheckCertValidationApiResponse = TaxInvoiceApiResponseBase
