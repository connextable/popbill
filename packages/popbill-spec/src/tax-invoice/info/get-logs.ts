import type { TaxInvoiceMgtKeyType } from '../common'
import type { TaxInvoiceLogApiModel } from '../models'

/**
 * TaxInvoice GetLogs Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/info#GetLogs
 */

/**
 * GetLogs API path 파라미터.
 */
export interface TaxInvoiceGetLogsApiRequestPath {
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
 * GetLogs API query 파라미터.
 */
export type TaxInvoiceGetLogsApiRequestQuery = never

/**
 * GetLogs API body.
 */
export type TaxInvoiceGetLogsApiRequestBody = never

/**
 * GetLogs API 요청(raw).
 */
export interface TaxInvoiceGetLogsApiRequest {
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

  path: TaxInvoiceGetLogsApiRequestPath

  query?: TaxInvoiceGetLogsApiRequestQuery

  body?: TaxInvoiceGetLogsApiRequestBody
}

/**
 * GetLogs API 응답(raw).
 */
export type TaxInvoiceGetLogsApiResponse = TaxInvoiceLogApiModel[]
