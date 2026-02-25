import type { TaxInvoiceApiRequest, TaxInvoiceApiResponseBase, TaxInvoiceMgtKeyType, TaxInvoiceRequireRequestFields } from '../common'

/**
 * TaxInvoice Delete Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/issue
 */

/**
 * Delete API path 파라미터.
 */
export interface TaxInvoiceDeleteApiRequestPath {
  /**
   * 문서번호 유형.
   *
   * - `SELL`: 매출
   * - `BUY`: 매입
   * - `TRUSTEE`: 위수탁
   */
  MgtKeyType: TaxInvoiceMgtKeyType

  /**
   * 파트너가 할당한 문서번호.
   */
  MgtKey: string
}

/**
 * Delete API query 파라미터.
 */
export type TaxInvoiceDeleteApiRequestQuery = never

/**
 * Delete API body.
 */
export type TaxInvoiceDeleteApiRequestBody = never

/**
 * Delete API 요청(raw).
 */
export type TaxInvoiceDeleteApiRequest = TaxInvoiceRequireRequestFields<
  TaxInvoiceApiRequest<
    TaxInvoiceDeleteApiRequestPath,
    TaxInvoiceDeleteApiRequestQuery,
    TaxInvoiceDeleteApiRequestBody
  >,
  'path'
>

export type TaxInvoiceDeleteApiResponse = TaxInvoiceApiResponseBase
