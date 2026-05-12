import type { TaxInvoiceApiRequest, TaxInvoiceMgtKeyType, TaxInvoiceRequireRequestFields } from '../common'
import type { TaxInvoiceInfoApiModel } from '../models'

/**
 * TaxInvoice GetInfos Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/info#GetInfos
 */

/**
 * GetInfos API path 파라미터.
 */
export interface TaxInvoiceGetInfosApiRequestPath {
  /**
   * 문서번호 유형.
   *
   * - `SELL`: 매출
   * - `BUY`: 매입
   * - `TRUSTEE`: 위수탁
   */
  MgtKeyType: TaxInvoiceMgtKeyType
}

/**
 * GetInfos API query 파라미터.
 */
export type TaxInvoiceGetInfosApiRequestQuery = never

/**
 * 문서번호 목록.
 *
 * GetInfos API body(raw).
 *
 * 최대 1,000건까지 조회할 수 있다.
 */
export type TaxInvoiceGetInfosApiRequestBody = string[]

/**
 * GetInfos API 요청(raw).
 */
export type TaxInvoiceGetInfosApiRequest = TaxInvoiceRequireRequestFields<
  TaxInvoiceApiRequest<TaxInvoiceGetInfosApiRequestPath, TaxInvoiceGetInfosApiRequestQuery, TaxInvoiceGetInfosApiRequestBody>,
  'path' | 'body'
>

/**
 * GetInfos API 응답(raw).
 */
export type TaxInvoiceGetInfosApiResponse = TaxInvoiceInfoApiModel[]
