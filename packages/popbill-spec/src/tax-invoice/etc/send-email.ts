import type { TaxInvoiceApiRequest, TaxInvoiceApiResponseBase, TaxInvoiceMgtKeyType, TaxInvoiceRequireRequestFields } from '../common'

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
export type TaxInvoiceSendEmailApiRequest = TaxInvoiceRequireRequestFields<
  TaxInvoiceApiRequest<TaxInvoiceSendEmailApiRequestPath, TaxInvoiceSendEmailApiRequestQuery, TaxInvoiceSendEmailApiRequestBody>,
  'path' | 'body'
>

export type TaxInvoiceSendEmailApiResponse = TaxInvoiceApiResponseBase
