import type { TaxInvoiceApiRequest, TaxInvoiceApiResponseBase, TaxInvoiceEmailType, TaxInvoiceRequireRequestFields } from '../common'

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
export type TaxInvoiceUpdateEmailConfigApiRequest = TaxInvoiceRequireRequestFields<
  TaxInvoiceApiRequest<
    TaxInvoiceUpdateEmailConfigApiRequestPath,
    TaxInvoiceUpdateEmailConfigApiRequestQuery,
    TaxInvoiceUpdateEmailConfigApiRequestBody
  >,
  'query'
>

export type TaxInvoiceUpdateEmailConfigApiResponse = TaxInvoiceApiResponseBase
