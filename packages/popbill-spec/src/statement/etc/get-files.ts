import type { StatementApiRequest, StatementDocumentApiRequestPath, StatementRequireRequestFields } from '../common'
import type { StatementFileApiModel } from '../models'

/**
 * 전자명세서 첨부파일 목록조회 API(raw).
 * @see https://developers.popbill.com/api-reference/statement/api/etc#GetFiles
 */
export type StatementGetFilesApiRequestPath = StatementDocumentApiRequestPath
export type StatementGetFilesApiRequestQuery = never
export type StatementGetFilesApiRequestBody = never
export type StatementGetFilesApiRequest = StatementRequireRequestFields<
  StatementApiRequest<StatementGetFilesApiRequestPath, StatementGetFilesApiRequestQuery, StatementGetFilesApiRequestBody>,
  'path'
>
export type StatementGetFilesApiResponse = StatementFileApiModel[]
