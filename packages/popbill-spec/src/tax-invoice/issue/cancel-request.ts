import type { TaxInvoiceApiResponseBase, TaxInvoiceMgtKeyType } from '../common'

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
export interface TaxInvoiceCancelRequestApiRequest {
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

  path: TaxInvoiceCancelRequestApiRequestPath

  query?: TaxInvoiceCancelRequestApiRequestQuery

  body?: TaxInvoiceCancelRequestApiRequestBody
}

export type TaxInvoiceCancelRequestApiResponse = TaxInvoiceApiResponseBase
