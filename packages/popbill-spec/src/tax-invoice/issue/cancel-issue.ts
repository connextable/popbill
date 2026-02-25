import type { TaxInvoiceApiResponseBase, TaxInvoiceMgtKeyType } from '../common'

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
export interface TaxInvoiceCancelIssueApiRequest {
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

  path: TaxInvoiceCancelIssueApiRequestPath

  query?: TaxInvoiceCancelIssueApiRequestQuery

  body?: TaxInvoiceCancelIssueApiRequestBody
}

export type TaxInvoiceCancelIssueApiResponse = TaxInvoiceApiResponseBase
