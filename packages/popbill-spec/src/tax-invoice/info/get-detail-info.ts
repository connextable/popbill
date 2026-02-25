import type { TaxInvoiceApiRequest, TaxInvoiceMgtKeyType, TaxInvoiceRequireRequestFields } from '../common'
import type { TaxInvoiceApiModel } from '../models'

/**
 * TaxInvoice GetDetailInfo Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/info#GetDetailInfo
 */

/**
 * GetDetailInfo API path 파라미터.
 */
export interface TaxInvoiceGetDetailInfoApiRequestPath {
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
 * GetDetailInfo API query 파라미터.
 */
export interface TaxInvoiceGetDetailInfoApiRequestQuery {
  /**
   * 상세 조회 옵션.
   *
   * `?Detail` 형태로 빈값 파라미터를 전달한다.
   */
  Detail: true
}

/**
 * GetDetailInfo API body.
 */
export type TaxInvoiceGetDetailInfoApiRequestBody = never

/**
 * GetDetailInfo API 요청(raw).
 */
export type TaxInvoiceGetDetailInfoApiRequest = TaxInvoiceRequireRequestFields<
  TaxInvoiceApiRequest<
    TaxInvoiceGetDetailInfoApiRequestPath,
    TaxInvoiceGetDetailInfoApiRequestQuery,
    TaxInvoiceGetDetailInfoApiRequestBody
  >,
  'path' | 'query'
>

export type TaxInvoiceGetDetailInfoApiResponse = TaxInvoiceApiModel
