/**
 * TaxInvoice GetSendToNTSConfig Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/etc#GetSendToNTSConfig
 */

/**
 * GetSendToNTSConfig API path 파라미터.
 */
export type TaxInvoiceGetSendToNTSConfigApiRequestPath = never

/**
 * GetSendToNTSConfig API query 파라미터.
 */
export type TaxInvoiceGetSendToNTSConfigApiRequestQuery = never

/**
 * GetSendToNTSConfig API body.
 */
export type TaxInvoiceGetSendToNTSConfigApiRequestBody = never

/**
 * GetSendToNTSConfig API 요청(raw).
 */
export interface TaxInvoiceGetSendToNTSConfigApiRequest {
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

  path?: TaxInvoiceGetSendToNTSConfigApiRequestPath

  query?: TaxInvoiceGetSendToNTSConfigApiRequestQuery

  body?: TaxInvoiceGetSendToNTSConfigApiRequestBody
}

export interface TaxInvoiceGetSendToNTSConfigApiResponse {
  /**
   * 국세청 전송 옵션 설정 상태.
   *
   * - `true`: 발행 즉시 전송
   * - `false`: 익일 자동 전송
   */
  sendToNTS: boolean | string
}
