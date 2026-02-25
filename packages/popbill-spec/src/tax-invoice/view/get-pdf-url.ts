import type { TaxInvoiceApiRequest, TaxInvoiceMgtKeyType, TaxInvoiceRequireRequestFields } from '../common'

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
export type TaxInvoiceGetPdfUrlApiRequest = TaxInvoiceRequireRequestFields<
  TaxInvoiceApiRequest<
    TaxInvoiceGetPdfUrlApiRequestPath,
    TaxInvoiceGetPdfUrlApiRequestQuery,
    TaxInvoiceGetPdfUrlApiRequestBody
  >,
  'path' | 'query'
>

export interface TaxInvoiceGetPdfUrlApiResponse {
  /**
   * 전자세금계산서 PDF 다운로드 URL.
   */
  url: string
}
