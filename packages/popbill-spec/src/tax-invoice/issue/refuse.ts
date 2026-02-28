import type { TaxInvoiceApiRequest, TaxInvoiceApiResponseBase, TaxInvoiceMgtKeyType, TaxInvoiceRequireRequestFields } from '../common'

/**
 * TaxInvoice Refuse Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/issue
 */

/**
 * Refuse API path 파라미터.
 */
export interface TaxInvoiceRefuseApiRequestPath {
  /**
   * 문서번호 유형.
   *
   * - `SELL`: 매출
   */
  MgtKeyType: Extract<TaxInvoiceMgtKeyType, 'SELL'>

  /**
   * 파트너가 할당한 문서번호.
   */
  MgtKey: string
}

/**
 * Refuse API query 파라미터.
 */
export type TaxInvoiceRefuseApiRequestQuery = never

/**
 * Refuse API body(raw).
 */
export interface TaxInvoiceRefuseApiRequestBody {
  /**
   * 세금계산서 상태 이력 관리를 위한 메모.
   */
  memo?: string
}

/**
 * Refuse API 요청(raw).
 */
export type TaxInvoiceRefuseApiRequest = TaxInvoiceRequireRequestFields<
  TaxInvoiceApiRequest<TaxInvoiceRefuseApiRequestPath, TaxInvoiceRefuseApiRequestQuery, TaxInvoiceRefuseApiRequestBody>,
  'path'
>

export type TaxInvoiceRefuseApiResponse = TaxInvoiceApiResponseBase
