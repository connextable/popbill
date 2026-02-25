import type { TaxInvoiceApiRequest, TaxInvoiceMgtKeyType, TaxInvoiceRequireRequestFields } from '../common'

/**
 * TaxInvoice GetXML Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/info#GetXML
 */

/**
 * GetXML API path 파라미터.
 */
export interface TaxInvoiceGetXmlApiRequestPath {
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
 * GetXML API query 파라미터.
 */
export interface TaxInvoiceGetXmlApiRequestQuery {
  /**
   * XML 조회 옵션.
   *
   * `?XML` 형태로 빈값 파라미터를 전달한다.
   */
  XML: true
}

/**
 * GetXML API body.
 */
export type TaxInvoiceGetXmlApiRequestBody = never

/**
 * GetXML API 요청(raw).
 */
export type TaxInvoiceGetXmlApiRequest = TaxInvoiceRequireRequestFields<
  TaxInvoiceApiRequest<
    TaxInvoiceGetXmlApiRequestPath,
    TaxInvoiceGetXmlApiRequestQuery,
    TaxInvoiceGetXmlApiRequestBody
  >,
  'path' | 'query'
>

/**
 * GetXML API 응답(raw).
 */
export interface TaxInvoiceGetXmlApiResponse {
  /**
   * 팝빌에서 할당한 식별번호.
   *
   * 일부 응답 호환성을 위해 optional로 유지한다.
   */
  itemKey?: string

  /**
   * 파트너가 할당한 문서번호.
   *
   * 일부 응답 호환성을 위해 optional로 유지한다.
   */
  mgtKey?: string

  /**
   * API 처리 결과코드.
   *
   * 성공: `1`
   */
  code?: number

  /**
   * API 처리 결과메시지.
   */
  message?: string

  /**
   * 전자세금계산서 XML 원문.
   */
  retObject?: string

  [key: string]: unknown
}
