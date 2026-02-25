import type { TaxInvoiceMgtKeyType } from '../common'

/**
 * TaxInvoice GetPDFURL Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/view#GetPDFURL
 */

/**
 * GetPDFURL API path 파라미터.
 */
export interface TaxInvoiceGetPdfUrlApiRequestPath {
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
 * GetPDFURL API query 파라미터.
 */
export interface TaxInvoiceGetPdfUrlApiRequestQuery {
  /**
   * 보기 타입 고정값.
   *
   * - `PDF`: PDF 다운로드 URL
   */
  TG: 'PDF'
}

/**
 * GetPDFURL API body.
 */
export type TaxInvoiceGetPdfUrlApiRequestBody = never

/**
 * GetPDFURL API 요청(raw).
 */
export interface TaxInvoiceGetPdfUrlApiRequest {
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

  path: TaxInvoiceGetPdfUrlApiRequestPath

  query: TaxInvoiceGetPdfUrlApiRequestQuery

  body?: TaxInvoiceGetPdfUrlApiRequestBody
}

export interface TaxInvoiceGetPdfUrlApiResponse {
  /**
   * 전자세금계산서 PDF 다운로드 URL.
   */
  url: string
}
