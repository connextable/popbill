import type { TaxInvoiceApiRequest, TaxInvoiceApiResponseBase, TaxInvoiceMgtKeyType, TaxInvoiceRequireRequestFields } from '../common'
import type { TaxInvoiceApiModel } from '../models'

/**
 * TaxInvoice Update Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/issue
 */

/**
 * Update API path 파라미터.
 */
export interface TaxInvoiceUpdateApiRequestPath {
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
 * Update API query 파라미터.
 */
export type TaxInvoiceUpdateApiRequestQuery = never

/**
 * Update API body(raw).
 */
export type TaxInvoiceUpdateApiRequestBody = TaxInvoiceApiModel & {
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
   *
   * 미입력 시 세금계산서 문서번호와 동일하게 할당된다.
   *
   * @deprecated `dealInvoiceMgtKey` 사용 권장.
   */
  dealInvoiceKey?: string

  /**
   * 거래명세서 문서번호.
   *
   * 최신 SDK camelCase 명칭으로 `dealInvoiceKey`와 동일한 의미다.
   */
  dealInvoiceMgtKey?: string
}

/**
 * Update API 요청(raw).
 */
export type TaxInvoiceUpdateApiRequest = TaxInvoiceRequireRequestFields<
  TaxInvoiceApiRequest<
    TaxInvoiceUpdateApiRequestPath,
    TaxInvoiceUpdateApiRequestQuery,
    TaxInvoiceUpdateApiRequestBody
  >,
  'path' | 'body'
>

export type TaxInvoiceUpdateApiResponse = TaxInvoiceApiResponseBase
