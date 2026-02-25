import type { TaxInvoiceBulkResultApiModel } from '../models'

/**
 * TaxInvoice GetBulkResult Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/issue
 */

/**
 * GetBulkResult API path 파라미터.
 */
export interface TaxInvoiceGetBulkResultApiRequestPath {
  /**
   * 파트너가 할당한 제출아이디.
   *
   * 영문, 숫자, `-` 조합으로 최대 36자.
   */
  SubmitID: string
}

/**
 * GetBulkResult API query 파라미터.
 */
export type TaxInvoiceGetBulkResultApiRequestQuery = never

/**
 * GetBulkResult API body.
 */
export type TaxInvoiceGetBulkResultApiRequestBody = never

/**
 * GetBulkResult API 요청(raw).
 */
export interface TaxInvoiceGetBulkResultApiRequest {
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

  path: TaxInvoiceGetBulkResultApiRequestPath

  query?: TaxInvoiceGetBulkResultApiRequestQuery

  body?: TaxInvoiceGetBulkResultApiRequestBody
}

export type TaxInvoiceGetBulkResultApiResponse = TaxInvoiceBulkResultApiModel
