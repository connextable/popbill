import type { TaxInvoiceApiRequest, TaxInvoiceApiResponseBase, TaxInvoiceMgtKeyType, TaxInvoiceRequireRequestFields } from '../common'

/**
 * TaxInvoice CancelRequest Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/issue
 */

/**
 * CancelRequest API path 파라미터.
 */
export interface TaxInvoiceCancelRequestApiRequestPath {
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
 * CancelRequest API query 파라미터.
 */
export type TaxInvoiceCancelRequestApiRequestQuery = never

/**
 * CancelRequest API body(raw).
 */
export interface TaxInvoiceCancelRequestApiRequestBody {
  /**
   * 세금계산서 상태 이력 관리를 위한 메모.
   */
  memo?: string
}

/**
 * CancelRequest API 요청(raw).
 */
export type TaxInvoiceCancelRequestApiRequest = TaxInvoiceRequireRequestFields<
  TaxInvoiceApiRequest<
    TaxInvoiceCancelRequestApiRequestPath,
    TaxInvoiceCancelRequestApiRequestQuery,
    TaxInvoiceCancelRequestApiRequestBody
  >,
  'path'
>

export type TaxInvoiceCancelRequestApiResponse = TaxInvoiceApiResponseBase
