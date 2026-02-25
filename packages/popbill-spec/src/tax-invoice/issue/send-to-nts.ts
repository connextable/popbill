import type { TaxInvoiceApiResponseBase, TaxInvoiceMgtKeyType } from '../common'

/**
 * TaxInvoice SendToNTS Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/issue
 */

/**
 * SendToNTS API path 파라미터.
 */
export interface TaxInvoiceSendToNTSApiRequestPath {
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
 * SendToNTS API query 파라미터.
 */
export type TaxInvoiceSendToNTSApiRequestQuery = never

/**
 * SendToNTS API body.
 */
export type TaxInvoiceSendToNTSApiRequestBody = never

/**
 * SendToNTS API 요청(raw).
 */
export interface TaxInvoiceSendToNTSApiRequest {
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

  path: TaxInvoiceSendToNTSApiRequestPath

  query?: TaxInvoiceSendToNTSApiRequestQuery

  body?: TaxInvoiceSendToNTSApiRequestBody
}

export type TaxInvoiceSendToNTSApiResponse = TaxInvoiceApiResponseBase
