import type { TaxInvoiceApiRequest, TaxInvoiceApiResponseBase, TaxInvoiceMgtKeyType, TaxInvoiceRequireRequestFields } from '../common'

/**
 * TaxInvoice AttachStatement Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/etc#AttachStatement
 */

/**
 * 전자명세서 문서유형 코드(raw).
 *
 * - `121`: 거래명세서
 * - `122`: 청구서
 * - `123`: 견적서
 * - `124`: 발주서
 * - `125`: 입금표
 * - `126`: 영수증
 */
export interface TaxInvoiceStatementItemCodeMap {
  /**
   * 거래명세서.
   */
  TradeStatement: 121

  /**
   * 청구서.
   */
  Invoice: 122

  /**
   * 견적서.
   */
  Estimate: 123

  /**
   * 발주서.
   */
  PurchaseOrder: 124

  /**
   * 입금표.
   */
  Deposit: 125

  /**
   * 영수증.
   */
  Receipt: 126
}

/**
 * 전자명세서 문서유형 코드(raw).
 */
export type TaxInvoiceStatementItemCode
  = TaxInvoiceStatementItemCodeMap[keyof TaxInvoiceStatementItemCodeMap]

/**
 * AttachStatement API path 파라미터.
 */
export interface TaxInvoiceAttachStatementApiRequestPath {
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
 * AttachStatement API query 파라미터.
 */
export type TaxInvoiceAttachStatementApiRequestQuery = never

/**
 * AttachStatement API body(raw).
 */
export interface TaxInvoiceAttachStatementApiRequestBody {
  /**
   * 첨부할 전자명세서 문서유형 코드.
   */
  ItemCode: TaxInvoiceStatementItemCode

  /**
   * 첨부할 전자명세서 문서번호.
   *
   * 전자명세서 발행 시 사용한 문서번호와 동일해야 한다.
   */
  MgtKey: string
}

/**
 * AttachStatement API 요청(raw).
 */
export type TaxInvoiceAttachStatementApiRequest = TaxInvoiceRequireRequestFields<
  TaxInvoiceApiRequest<
    TaxInvoiceAttachStatementApiRequestPath,
    TaxInvoiceAttachStatementApiRequestQuery,
    TaxInvoiceAttachStatementApiRequestBody
  >,
  'path' | 'body'
>

export type TaxInvoiceAttachStatementApiResponse = TaxInvoiceApiResponseBase
