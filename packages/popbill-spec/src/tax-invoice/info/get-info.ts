import type { TaxInvoiceApiRequest, TaxInvoiceMgtKeyType, TaxInvoiceRequireRequestFields } from '../common'
import type { TaxInvoiceInfoApiModel } from '../models'

/**
 * TaxInvoice GetInfo Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/info#GetInfo
 */

/**
 * GetInfo API path 파라미터.
 */
export interface TaxInvoiceGetInfoApiRequestPath {
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
 * GetInfo API query 파라미터.
 */
export type TaxInvoiceGetInfoApiRequestQuery = never

/**
 * GetInfo API body.
 */
export type TaxInvoiceGetInfoApiRequestBody = never

/**
 * GetInfo API 요청(raw).
 */
export type TaxInvoiceGetInfoApiRequest = TaxInvoiceRequireRequestFields<
  TaxInvoiceApiRequest<TaxInvoiceGetInfoApiRequestPath, TaxInvoiceGetInfoApiRequestQuery, TaxInvoiceGetInfoApiRequestBody>,
  'path'
>

export type TaxInvoiceGetInfoApiResponse = TaxInvoiceInfoApiModel

export type TaxInvoiceInfoApiResponse = TaxInvoiceGetInfoApiResponse
