import type { TaxInvoiceApiRequest, TaxInvoiceApiResponseBase, TaxInvoiceRequireRequestFields } from '../common'
import type { TaxInvoiceApiModel } from '../models'

/**
 * TaxInvoice RegistRequest Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/issue
 */

/**
 * RegistRequest API path 파라미터.
 */
export type TaxInvoiceRegistRequestApiRequestPath = never

/**
 * RegistRequest API query 파라미터.
 */
export type TaxInvoiceRegistRequestApiRequestQuery = never

/**
 * RegistRequest API body(raw).
 */
export type TaxInvoiceRegistRequestApiRequestBody = TaxInvoiceApiModel & {
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
   * 거래명세서 문서번호.
   */
  dealInvoiceMgtKey?: string
}

/**
 * RegistRequest API 요청(raw).
 */
export type TaxInvoiceRegistRequestApiRequest = TaxInvoiceRequireRequestFields<
  TaxInvoiceApiRequest<TaxInvoiceRegistRequestApiRequestPath, TaxInvoiceRegistRequestApiRequestQuery, TaxInvoiceRegistRequestApiRequestBody>,
  'body'
>

export type TaxInvoiceRegistRequestApiResponse = TaxInvoiceApiResponseBase
