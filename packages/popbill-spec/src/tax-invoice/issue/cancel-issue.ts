import type { TaxInvoiceApiRequest, TaxInvoiceApiResponseBase, TaxInvoiceMgtKeyType, TaxInvoiceRequireRequestFields } from '../common'

/**
 * TaxInvoice CancelIssue Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/issue
 */

/**
 * CancelIssue API path 파라미터.
 */
export interface TaxInvoiceCancelIssueApiRequestPath {
  /**
   * 문서번호 유형.
   *
   * - `SELL`: 매출
   * - `TRUSTEE`: 위수탁
   */
  MgtKeyType: Extract<TaxInvoiceMgtKeyType, 'SELL' | 'TRUSTEE'>

  /**
   * 파트너가 할당한 문서번호.
   */
  MgtKey: string
}

/**
 * CancelIssue API query 파라미터.
 */
export type TaxInvoiceCancelIssueApiRequestQuery = never

/**
 * CancelIssue API body(raw).
 */
export interface TaxInvoiceCancelIssueApiRequestBody {
  /**
   * 세금계산서 상태 이력 관리를 위한 메모.
   */
  memo?: string
}

/**
 * CancelIssue API 요청(raw).
 */
export type TaxInvoiceCancelIssueApiRequest = TaxInvoiceRequireRequestFields<
  TaxInvoiceApiRequest<
    TaxInvoiceCancelIssueApiRequestPath,
    TaxInvoiceCancelIssueApiRequestQuery,
    TaxInvoiceCancelIssueApiRequestBody
  >,
  'path'
>

export type TaxInvoiceCancelIssueApiResponse = TaxInvoiceApiResponseBase
