import type { TaxInvoiceApiRequest, TaxInvoiceBulkIssueRequestHeaders, TaxInvoiceRequireRequestFields } from '../common'
import type { TaxInvoiceBulkSubmitResponseApiModel, TaxInvoiceApiModel } from '../models'

/**
 * TaxInvoice BulkSubmit Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/issue
 */

/**
 * BulkSubmit API path 파라미터.
 */
export type TaxInvoiceBulkSubmitApiRequestPath = never

/**
 * BulkSubmit API query 파라미터.
 */
export type TaxInvoiceBulkSubmitApiRequestQuery = never

/**
 * BulkSubmit API header(raw).
 */
export type TaxInvoiceBulkSubmitApiRequestHeaders = TaxInvoiceBulkIssueRequestHeaders

/**
 * BulkSubmit API body(raw).
 */
export interface TaxInvoiceBulkSubmitApiRequestBody {
  /**
   * 전자세금계산서 목록.
   *
   * 최대 100건까지 접수할 수 있다.
   */
  invoices: TaxInvoiceApiModel[]

  /**
   * 지연발행 가능 여부.
   *
   * `true`: 가능
   * `false`: 불가능 (기본값)
   */
  forceIssue?: boolean
}

/**
 * BulkSubmit API 요청(raw).
 */
export type TaxInvoiceBulkSubmitApiRequest = TaxInvoiceRequireRequestFields<
  TaxInvoiceApiRequest<
    TaxInvoiceBulkSubmitApiRequestPath,
    TaxInvoiceBulkSubmitApiRequestQuery,
    TaxInvoiceBulkSubmitApiRequestBody,
    TaxInvoiceBulkSubmitApiRequestHeaders
  >,
  'body' | 'headers'
>

export type TaxInvoiceBulkSubmitApiResponse = TaxInvoiceBulkSubmitResponseApiModel
