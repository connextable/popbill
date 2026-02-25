import type { TaxInvoiceBulkSubmitResponseApiModel, TaxInvoiceApiModel } from '../models'

/**
 * TaxInvoice BulkSubmit Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/issue
 */

/**
 * BulkSubmit API path 파라미터.
 */
export type TaxInvoiceBulkSubmitApiRequestPath = never

/**
 * BulkSubmit API query 파라미터.
 */
export type TaxInvoiceBulkSubmitApiRequestQuery = never

/**
 * BulkSubmit API header(raw).
 */
export interface TaxInvoiceBulkSubmitApiRequestHeaders {
  /**
   * 요청 본문 무결성 검증용 Message Digest.
   *
   * HTTP 헤더 `X-PB-Message-Digest`로 전달한다.
   */
  MessageDigest: string

  /**
   * 파트너가 할당한 제출아이디.
   *
   * 영문, 숫자, `-` 조합으로 최대 36자.
   * HTTP 헤더 `X-PB-Submit-ID`로 전달한다.
   */
  SubmitID: string
}

/**
 * BulkSubmit API body(raw).
 */
export interface TaxInvoiceBulkSubmitApiRequestBody {
  /**
   * 전자세금계산서 목록.
   *
   * 최대 100건까지 접수할 수 있다.
   */
  invoices: TaxInvoiceApiModel[]

  /**
   * 지연발행 가능 여부.
   *
   * `true`: 가능
   * `false`: 불가능 (기본값)
   */
  forceIssue?: boolean
}

/**
 * BulkSubmit API 요청(raw).
 */
export interface TaxInvoiceBulkSubmitApiRequest {
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

  path?: TaxInvoiceBulkSubmitApiRequestPath

  query?: TaxInvoiceBulkSubmitApiRequestQuery

  headers: TaxInvoiceBulkSubmitApiRequestHeaders

  body: TaxInvoiceBulkSubmitApiRequestBody
}

export type TaxInvoiceBulkSubmitApiResponse = TaxInvoiceBulkSubmitResponseApiModel
