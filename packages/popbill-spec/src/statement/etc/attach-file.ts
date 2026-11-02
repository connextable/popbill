import type { StatementApiRequest, StatementApiResponseBase, StatementDocumentApiRequestPath, StatementRequireRequestFields } from '../common'

/**
 * 전자명세서 파일 첨부 API(raw).
 * @see https://developers.popbill.com/api-reference/statement/api/etc#AttachFile
 */
export type StatementAttachFileApiRequestPath = StatementDocumentApiRequestPath
export type StatementAttachFileApiRequestQuery = never
/** multipart 파일 파트의 이름은 Filedata다. */
export interface StatementAttachFileApiRequestBody {
  Filedata: Blob
  /** Legacy 경로 첨부의 표시명. */
  DisplayName?: string
}
export type StatementAttachFileApiRequest = StatementRequireRequestFields<
  StatementApiRequest<StatementAttachFileApiRequestPath, StatementAttachFileApiRequestQuery, StatementAttachFileApiRequestBody>,
  'path' | 'body'
>
export type StatementAttachFileApiResponse = StatementApiResponseBase

export interface StatementAttachFileMultipartPayload {
  filePath: string
  displayName?: string
}
