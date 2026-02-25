import type { TaxInvoiceApiResponseBase, TaxInvoiceMgtKeyType } from '../common'

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
export type TaxInvoiceStatementItemCode = 121 | 122 | 123 | 124 | 125 | 126

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
export interface TaxInvoiceAttachStatementApiRequest {
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

  path: TaxInvoiceAttachStatementApiRequestPath

  query?: TaxInvoiceAttachStatementApiRequestQuery

  body: TaxInvoiceAttachStatementApiRequestBody
}

export type TaxInvoiceAttachStatementApiResponse = TaxInvoiceApiResponseBase
