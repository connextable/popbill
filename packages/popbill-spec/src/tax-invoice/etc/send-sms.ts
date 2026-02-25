import type { TaxInvoiceApiResponseBase, TaxInvoiceMgtKeyType } from '../common'

/**
 * TaxInvoice SendSMS Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/etc#SendSMS
 */

/**
 * SendSMS API path 파라미터.
 */
export interface TaxInvoiceSendSmsApiRequestPath {
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
 * SendSMS API query 파라미터.
 */
export type TaxInvoiceSendSmsApiRequestQuery = never

/**
 * SendSMS API body(raw).
 */
export interface TaxInvoiceSendSmsApiRequestBody {
  /**
   * 발신번호.
   */
  sender: string

  /**
   * 수신번호.
   */
  receiver: string

  /**
   * 메시지 내용.
   *
   * 최대 90byte까지 전달되며 초과분은 자동 삭제된다.
   */
  contents: string
}

/**
 * SendSMS API 요청(raw).
 */
export interface TaxInvoiceSendSmsApiRequest {
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

  path: TaxInvoiceSendSmsApiRequestPath

  query?: TaxInvoiceSendSmsApiRequestQuery

  body: TaxInvoiceSendSmsApiRequestBody
}

export type TaxInvoiceSendSmsApiResponse = TaxInvoiceApiResponseBase
