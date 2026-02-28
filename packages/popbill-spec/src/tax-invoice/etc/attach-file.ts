import type { TaxInvoiceApiRequest, TaxInvoiceApiResponseBase, TaxInvoiceMgtKeyType, TaxInvoiceRequireRequestFields } from '../common'

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
export type TaxInvoiceAttachFileApiRequest = TaxInvoiceRequireRequestFields<
  TaxInvoiceApiRequest<TaxInvoiceAttachFileApiRequestPath, TaxInvoiceAttachFileApiRequestQuery, TaxInvoiceAttachFileApiRequestBody>,
  'path'
>

export type TaxInvoiceAttachFileApiResponse = TaxInvoiceApiResponseBase
