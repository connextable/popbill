import type { TaxInvoiceApiResponseBase, TaxInvoiceMgtKeyType } from '../common'

/**
 * TaxInvoice AttachFile Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/etc#AttachFile
 */

/**
 * AttachFile API path 파라미터.
 */
export interface TaxInvoiceAttachFileApiRequestPath {
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
 * AttachFile API query 파라미터.
 */
export type TaxInvoiceAttachFileApiRequestQuery = never

/**
 * AttachFile API body(raw form-data form part).
 */
export interface TaxInvoiceAttachFileApiRequestBody {
  /**
   * 첨부파일 표시명.
   *
   * 일부 구현/호환성에서만 사용한다.
   */
  DisplayName?: string
}

/**
 * AttachFile API 바이너리 파일 payload.
 */
export interface TaxInvoiceAttachFileBinaryPayload {
  /**
   * 첨부 파일명.
   */
  fileName: string

  /**
   * 첨부 파일 데이터.
   */
  fileData: Buffer
}

/**
 * AttachFile API multipart 파일 payload.
 */
export interface TaxInvoiceAttachFileMultipartPayload {
  /**
   * 첨부할 로컬 파일 경로.
   */
  filePath: string

  /**
   * 첨부파일 표시명.
   */
  displayName?: string
}

/**
 * AttachFile API 요청(raw).
 */
export interface TaxInvoiceAttachFileApiRequest {
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

  path: TaxInvoiceAttachFileApiRequestPath

  query?: TaxInvoiceAttachFileApiRequestQuery

  body?: TaxInvoiceAttachFileApiRequestBody

  /**
   * multipart 기반 파일 목록.
   *
   * API 1회 호출당 1개 파일 첨부가 기본이며,
   * 문서 전체 첨부파일 수는 최대 5개다.
   */
  files?: TaxInvoiceAttachFileMultipartPayload[]

  /**
   * 바이너리 기반 파일 목록.
   *
   * API 1회 호출당 1개 파일 첨부가 기본이며,
   * 문서 전체 첨부파일 수는 최대 5개다.
   */
  binaryFiles?: TaxInvoiceAttachFileBinaryPayload[]
}

export type TaxInvoiceAttachFileApiResponse = TaxInvoiceApiResponseBase
