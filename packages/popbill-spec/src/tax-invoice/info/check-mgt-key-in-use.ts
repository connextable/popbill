import type { TaxInvoiceMgtKeyType } from '../common'

/**
 * TaxInvoice CheckMgtKeyInUse Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/info#CheckMgtKeyInUse
 */

/**
 * CheckMgtKeyInUse API path 파라미터.
 */
export interface TaxInvoiceCheckMgtKeyInUseApiRequestPath {
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
   *
   * 최대 24자.
   */
  MgtKey: string
}

/**
 * CheckMgtKeyInUse API query 파라미터.
 */
export type TaxInvoiceCheckMgtKeyInUseApiRequestQuery = never

/**
 * CheckMgtKeyInUse API body.
 */
export type TaxInvoiceCheckMgtKeyInUseApiRequestBody = never

/**
 * CheckMgtKeyInUse API 요청(raw).
 */
export interface TaxInvoiceCheckMgtKeyInUseApiRequest {
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

  path: TaxInvoiceCheckMgtKeyInUseApiRequestPath

  query?: TaxInvoiceCheckMgtKeyInUseApiRequestQuery

  body?: TaxInvoiceCheckMgtKeyInUseApiRequestBody
}

/**
 * CheckMgtKeyInUse API 응답(raw).
 */
export interface TaxInvoiceCheckMgtKeyInUseApiResponse {
  /**
   * 팝빌에서 할당한 식별번호.
   *
   * 값이 존재하면 사용 중인 문서번호, 없으면 사용 가능한 문서번호다.
   */
  itemKey?: string

  [key: string]: unknown
}
