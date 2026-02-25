import type { TaxInvoiceApiRequest, TaxInvoiceApiResponseBase, TaxInvoiceMgtKeyType, TaxInvoiceRequireRequestFields } from '../common'

/**
 * TaxInvoice AssignMgtKey Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/etc#AssignMgtKey
 */

/**
 * AssignMgtKey API path 파라미터.
 */
export interface TaxInvoiceAssignMgtKeyApiRequestPath {
  /**
   * 팝빌에서 할당한 식별번호(ItemKey).
   *
   * 최대 18자.
   */
  ItemKey: string

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
 * AssignMgtKey API query 파라미터.
 */
export type TaxInvoiceAssignMgtKeyApiRequestQuery = never

/**
 * AssignMgtKey API body(raw).
 */
export interface TaxInvoiceAssignMgtKeyApiRequestBody {
  /**
   * 파트너가 할당한 문서번호.
   *
   * 최대 24자.
   */
  MgtKey: string
}

/**
 * AssignMgtKey API 요청(raw).
 */
export type TaxInvoiceAssignMgtKeyApiRequest = TaxInvoiceRequireRequestFields<
  TaxInvoiceApiRequest<
    TaxInvoiceAssignMgtKeyApiRequestPath,
    TaxInvoiceAssignMgtKeyApiRequestQuery,
    TaxInvoiceAssignMgtKeyApiRequestBody
  >,
  'path' | 'body'
>

export type TaxInvoiceAssignMgtKeyApiResponse = TaxInvoiceApiResponseBase
