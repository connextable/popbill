import type {
  TaxInvoiceApiRequest,
  TaxInvoiceApiResponseBase,
  TaxInvoiceMgtKeyType,
  TaxInvoiceRequireRequestFields,
} from '../common'
import type { TaxInvoiceStatementItemCode } from './attach-statement'

/**
 * TaxInvoice DetachStatement Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/etc#DetachStatement
 */

/**
 * DetachStatement API path 파라미터.
 */
export interface TaxInvoiceDetachStatementApiRequestPath {
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
 * DetachStatement API query 파라미터.
 */
export type TaxInvoiceDetachStatementApiRequestQuery = never

/**
 * DetachStatement API body(raw).
 */
export interface TaxInvoiceDetachStatementApiRequestBody {
  /**
   * 첨부해제할 전자명세서 문서유형 코드.
   */
  ItemCode: TaxInvoiceStatementItemCode

  /**
   * 첨부해제할 전자명세서 문서번호.
   *
   * 전자명세서 발행 시 사용한 문서번호와 동일해야 한다.
   */
  MgtKey: string
}

/**
 * DetachStatement API 요청(raw).
 */
export type TaxInvoiceDetachStatementApiRequest = TaxInvoiceRequireRequestFields<
  TaxInvoiceApiRequest<
    TaxInvoiceDetachStatementApiRequestPath,
    TaxInvoiceDetachStatementApiRequestQuery,
    TaxInvoiceDetachStatementApiRequestBody
  >,
  'path' | 'body'
>

export type TaxInvoiceDetachStatementApiResponse = TaxInvoiceApiResponseBase
