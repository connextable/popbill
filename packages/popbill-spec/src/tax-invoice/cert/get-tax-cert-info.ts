import type { TaxInvoiceTaxCertInfoApiModel } from '../models'

/**
 * TaxInvoice GetTaxCertInfo Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/cert#GetTaxCertInfo
 */

/**
 * GetTaxCertInfo API path 파라미터.
 */
export type TaxInvoiceGetTaxCertInfoApiRequestPath = never

/**
 * GetTaxCertInfo API query 파라미터.
 */
export type TaxInvoiceGetTaxCertInfoApiRequestQuery = never

/**
 * GetTaxCertInfo API body.
 */
export type TaxInvoiceGetTaxCertInfoApiRequestBody = never

/**
 * GetTaxCertInfo API 요청(raw).
 */
export interface TaxInvoiceGetTaxCertInfoApiRequest {
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

  path?: TaxInvoiceGetTaxCertInfoApiRequestPath

  query?: TaxInvoiceGetTaxCertInfoApiRequestQuery

  body?: TaxInvoiceGetTaxCertInfoApiRequestBody
}

export type TaxInvoiceGetTaxCertInfoApiResponse = TaxInvoiceTaxCertInfoApiModel
