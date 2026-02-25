import type { TaxInvoiceApiResponseBase, TaxInvoiceEmailType } from '../common'

/**
 * TaxInvoice UpdateEmailConfig Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/etc#UpdateEmailConfig
 */

/**
 * UpdateEmailConfig API path 파라미터.
 */
export type TaxInvoiceUpdateEmailConfigApiRequestPath = never

/**
 * UpdateEmailConfig API query 파라미터.
 */
export interface TaxInvoiceUpdateEmailConfigApiRequestQuery {
  /**
   * 메일 전송 유형.
   */
  EmailType: TaxInvoiceEmailType

  /**
   * 전송 여부.
   *
   * - `true`: 전송
   * - `false`: 미전송
   */
  SendYN: boolean
}

/**
 * UpdateEmailConfig API body.
 */
export type TaxInvoiceUpdateEmailConfigApiRequestBody = never

/**
 * UpdateEmailConfig API 요청(raw).
 */
export interface TaxInvoiceUpdateEmailConfigApiRequest {
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

  path?: TaxInvoiceUpdateEmailConfigApiRequestPath

  query: TaxInvoiceUpdateEmailConfigApiRequestQuery

  body?: TaxInvoiceUpdateEmailConfigApiRequestBody
}

export type TaxInvoiceUpdateEmailConfigApiResponse = TaxInvoiceApiResponseBase
