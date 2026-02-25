import type { TaxInvoiceEmailConfigApiModel } from '../models'

/**
 * TaxInvoice ListEmailConfig Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/etc#ListEmailConfig
 */

/**
 * ListEmailConfig API path 파라미터.
 */
export type TaxInvoiceListEmailConfigApiRequestPath = never

/**
 * ListEmailConfig API query 파라미터.
 */
export type TaxInvoiceListEmailConfigApiRequestQuery = never

/**
 * ListEmailConfig API body.
 */
export type TaxInvoiceListEmailConfigApiRequestBody = never

/**
 * ListEmailConfig API 요청(raw).
 */
export interface TaxInvoiceListEmailConfigApiRequest {
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

  path?: TaxInvoiceListEmailConfigApiRequestPath

  query?: TaxInvoiceListEmailConfigApiRequestQuery

  body?: TaxInvoiceListEmailConfigApiRequestBody
}

/**
 * ListEmailConfig API 응답(raw).
 */
export type TaxInvoiceListEmailConfigApiResponse = TaxInvoiceEmailConfigApiModel[]
