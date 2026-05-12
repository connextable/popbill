import type { TaxInvoiceApiRequest } from '../common'
/**
 * TaxInvoice GetSendToNTSConfig Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/etc#GetSendToNTSConfig
 */

/**
 * GetSendToNTSConfig API path 파라미터.
 */
export type TaxInvoiceGetSendToNTSConfigApiRequestPath = never

/**
 * GetSendToNTSConfig API query 파라미터.
 */
export type TaxInvoiceGetSendToNTSConfigApiRequestQuery = never

/**
 * GetSendToNTSConfig API body.
 */
export type TaxInvoiceGetSendToNTSConfigApiRequestBody = never

/**
 * GetSendToNTSConfig API 요청(raw).
 */
export type TaxInvoiceGetSendToNTSConfigApiRequest = TaxInvoiceApiRequest<
  TaxInvoiceGetSendToNTSConfigApiRequestPath,
  TaxInvoiceGetSendToNTSConfigApiRequestQuery,
  TaxInvoiceGetSendToNTSConfigApiRequestBody
>

export interface TaxInvoiceGetSendToNTSConfigApiResponse {
  /**
   * 국세청 전송 옵션 설정 상태.
   *
   * - `true`: 발행 즉시 전송
   * - `false`: 익일 자동 전송
   */
  sendToNTS: boolean | string
}
