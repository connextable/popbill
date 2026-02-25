import type { TaxInvoiceApiRequest, TaxInvoiceApiResponseBase, TaxInvoiceMgtKeyType, TaxInvoiceRequireRequestFields } from '../common'

/**
 * TaxInvoice Request Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/issue
 */

/**
 * Request API path 파라미터.
 */
export interface TaxInvoiceRequestApiRequestPath {
  /**
   * 문서번호 유형.
   *
   * - `BUY`: 매입
   */
  MgtKeyType: Extract<TaxInvoiceMgtKeyType, 'BUY'>

  /**
   * 파트너가 할당한 문서번호.
   */
  MgtKey: string
}

/**
 * Request API query 파라미터.
 */
export type TaxInvoiceRequestApiRequestQuery = never

/**
 * Request API body(raw).
 */
export interface TaxInvoiceRequestApiRequestBody {
  /**
   * 세금계산서 상태 이력 관리를 위한 메모.
   */
  memo?: string
}

/**
 * Request API 요청(raw).
 */
export type TaxInvoiceRequestApiRequest = TaxInvoiceRequireRequestFields<
  TaxInvoiceApiRequest<
    TaxInvoiceRequestApiRequestPath,
    TaxInvoiceRequestApiRequestQuery,
    TaxInvoiceRequestApiRequestBody
  >,
  'path'
>

export type TaxInvoiceRequestApiResponse = TaxInvoiceApiResponseBase
