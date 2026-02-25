import type { TaxInvoiceApiRequest, TaxInvoiceMgtKeyType, TaxInvoiceRequireRequestFields } from '../common'
import type { TaxInvoiceIssueResponseApiModel } from '../models'

/**
 * TaxInvoice Issue Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/issue
 */

/**
 * Issue API path 파라미터.
 */
export interface TaxInvoiceIssueApiRequestPath {
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
 * Issue API query 파라미터.
 */
export type TaxInvoiceIssueApiRequestQuery = never

/**
 * Issue API body(raw).
 */
export interface TaxInvoiceIssueApiRequestBody {
  /**
   * 세금계산서 상태 이력 관리를 위한 메모.
   */
  memo?: string

  /**
   * 세금계산서 발행 안내메일 제목.
   *
   * 미입력 시 팝빌 기본 제목을 사용한다.
   */
  emailSubject?: string

  /**
   * 지연발행 가능 여부.
   *
   * `true`: 가능
   * `false`: 불가능 (기본값)
   */
  forceIssue?: boolean
}

/**
 * Issue API 요청(raw).
 */
export type TaxInvoiceIssueApiRequest = TaxInvoiceRequireRequestFields<
  TaxInvoiceApiRequest<
    TaxInvoiceIssueApiRequestPath,
    TaxInvoiceIssueApiRequestQuery,
    TaxInvoiceIssueApiRequestBody
  >,
  'path'
>

export type TaxInvoiceIssueApiResponse = TaxInvoiceIssueResponseApiModel
