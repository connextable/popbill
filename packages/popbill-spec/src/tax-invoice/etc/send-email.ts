import type { TaxInvoiceApiResponseBase, TaxInvoiceMgtKeyType } from '../common'

/**
 * TaxInvoice SendEmail Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/etc#SendEmail
 */

/**
 * SendEmail API path 파라미터.
 */
export interface TaxInvoiceSendEmailApiRequestPath {
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
 * SendEmail API query 파라미터.
 */
export type TaxInvoiceSendEmailApiRequestQuery = never

/**
 * SendEmail API body(raw).
 */
export interface TaxInvoiceSendEmailApiRequestBody {
  /**
   * 수신자 메일주소.
   */
  receiver: string
}

/**
 * SendEmail API 요청(raw).
 */
export interface TaxInvoiceSendEmailApiRequest {
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

  path: TaxInvoiceSendEmailApiRequestPath

  query?: TaxInvoiceSendEmailApiRequestQuery

  body: TaxInvoiceSendEmailApiRequestBody
}

export type TaxInvoiceSendEmailApiResponse = TaxInvoiceApiResponseBase
