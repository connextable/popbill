import type { TaxInvoiceApiResponseBase, TaxInvoiceMgtKeyType } from '../common'

/**
 * TaxInvoice DeleteFile Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/etc#DeleteFile
 */

/**
 * DeleteFile API path 파라미터.
 */
export interface TaxInvoiceDeleteFileApiRequestPath {
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

  /**
   * 팝빌이 할당한 파일 식별번호.
   *
   * GetFiles 응답의 `attachedFile` 값을 사용한다.
   */
  FileID: string
}

/**
 * DeleteFile API query 파라미터.
 */
export type TaxInvoiceDeleteFileApiRequestQuery = never

/**
 * DeleteFile API body.
 */
export type TaxInvoiceDeleteFileApiRequestBody = never

/**
 * DeleteFile API 요청(raw).
 */
export interface TaxInvoiceDeleteFileApiRequest {
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

  path: TaxInvoiceDeleteFileApiRequestPath

  query?: TaxInvoiceDeleteFileApiRequestQuery

  body?: TaxInvoiceDeleteFileApiRequestBody
}

export type TaxInvoiceDeleteFileApiResponse = TaxInvoiceApiResponseBase
