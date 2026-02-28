import type { TaxInvoiceApiRequest, TaxInvoiceMgtKeyType, TaxInvoiceRequireRequestFields } from '../common'
import type { TaxInvoiceFileMetaApiModel } from '../models'

/**
 * TaxInvoice GetFiles Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/etc#GetFiles
 */

/**
 * GetFiles API path 파라미터.
 */
export interface TaxInvoiceGetFilesApiRequestPath {
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
 * GetFiles API query 파라미터.
 */
export type TaxInvoiceGetFilesApiRequestQuery = never

/**
 * GetFiles API body.
 */
export type TaxInvoiceGetFilesApiRequestBody = never

/**
 * GetFiles API 요청(raw).
 */
export type TaxInvoiceGetFilesApiRequest = TaxInvoiceRequireRequestFields<
  TaxInvoiceApiRequest<TaxInvoiceGetFilesApiRequestPath, TaxInvoiceGetFilesApiRequestQuery, TaxInvoiceGetFilesApiRequestBody>,
  'path'
>

/**
 * GetFiles API 응답(raw).
 */
export type TaxInvoiceGetFilesApiResponse = TaxInvoiceFileMetaApiModel[]
