import type { TaxInvoiceApiRequest, TaxInvoiceRequireRequestFields } from '../common'
import type { TaxInvoiceIssueResponseApiModel, TaxInvoiceApiModel } from '../models'

/**
 * TaxInvoice RegistIssue Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/issue
 */

/**
 * RegistIssue API path 파라미터.
 */
export type TaxInvoiceRegistIssueApiRequestPath = never

/**
 * RegistIssue API query 파라미터.
 */
export type TaxInvoiceRegistIssueApiRequestQuery = never

/**
 * RegistIssue API body(raw).
 */
export type TaxInvoiceRegistIssueApiRequestBody = TaxInvoiceApiModel & {
  /**
   * 거래명세서 동시작성 여부.
   *
   * 공급받는자 유형이 `사업자`인 경우에만 사용할 수 있다.
   */
  writeSpecification?: boolean

  /**
   * 지연발행 가능 여부.
   *
   * `true`: 가능
   * `false`: 불가능 (기본값)
   */
  forceIssue?: boolean

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
   * 거래명세서 문서번호.
   */
  dealInvoiceMgtKey?: string
}

/**
 * RegistIssue API 요청(raw).
 */
export type TaxInvoiceRegistIssueApiRequest = TaxInvoiceRequireRequestFields<
  TaxInvoiceApiRequest<TaxInvoiceRegistIssueApiRequestPath, TaxInvoiceRegistIssueApiRequestQuery, TaxInvoiceRegistIssueApiRequestBody>,
  'body'
>

export type TaxInvoiceRegistIssueApiResponse = TaxInvoiceIssueResponseApiModel
