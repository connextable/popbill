import type { TaxInvoiceApiResponseBase, TaxInvoiceMgtKeyType } from '../common'

/**
 * TaxInvoice SendFAX Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/etc#SendFAX
 */

/**
 * SendFAX API path 파라미터.
 */
export interface TaxInvoiceSendFaxApiRequestPath {
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
 * SendFAX API query 파라미터.
 */
export type TaxInvoiceSendFaxApiRequestQuery = never

/**
 * SendFAX API body(raw).
 */
export interface TaxInvoiceSendFaxApiRequestBody {
  /**
   * 발신번호.
   */
  sender: string

  /**
   * 수신번호.
   */
  receiver: string
}

/**
 * SendFAX API 요청(raw).
 */
export interface TaxInvoiceSendFaxApiRequest {
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

  path: TaxInvoiceSendFaxApiRequestPath

  query?: TaxInvoiceSendFaxApiRequestQuery

  body: TaxInvoiceSendFaxApiRequestBody
}

export type TaxInvoiceSendFaxApiResponse = TaxInvoiceApiResponseBase
