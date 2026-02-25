import type { TaxInvoiceApiRequest, TaxInvoiceApiResponseBase, TaxInvoiceMgtKeyType, TaxInvoiceRequireRequestFields } from '../common'

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
export type TaxInvoiceSendToNTSApiRequest = TaxInvoiceRequireRequestFields<
  TaxInvoiceApiRequest<
    TaxInvoiceSendToNTSApiRequestPath,
    TaxInvoiceSendToNTSApiRequestQuery,
    TaxInvoiceSendToNTSApiRequestBody
  >,
  'path'
>

export type TaxInvoiceSendToNTSApiResponse = TaxInvoiceApiResponseBase
