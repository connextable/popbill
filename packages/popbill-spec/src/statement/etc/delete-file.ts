import type { StatementApiRequest, StatementApiResponseBase, StatementDocumentApiRequestPath, StatementRequireRequestFields } from '../common'

/**
 * 전자명세서 첨부파일 삭제 API(raw).
 * @see https://developers.popbill.com/api-reference/statement/api/etc#DeleteFile
 */
export interface StatementDeleteFileApiRequestPath extends StatementDocumentApiRequestPath {
  FileID: string
}
export type StatementDeleteFileApiRequestQuery = never
export type StatementDeleteFileApiRequestBody = never
export type StatementDeleteFileApiRequest = StatementRequireRequestFields<
  StatementApiRequest<StatementDeleteFileApiRequestPath, StatementDeleteFileApiRequestQuery, StatementDeleteFileApiRequestBody>,
  'path'
>
export type StatementDeleteFileApiResponse = StatementApiResponseBase
