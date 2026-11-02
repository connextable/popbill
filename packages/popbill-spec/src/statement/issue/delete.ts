import type { StatementApiRequest, StatementApiResponseBase, StatementDocumentApiRequestPath, StatementRequireRequestFields } from '../common'

/**
 * 전자명세서 삭제 API(raw).
 * @see https://developers.popbill.com/api-reference/statement/api/issue#Delete
 */
export type StatementDeleteApiRequestPath = StatementDocumentApiRequestPath
export type StatementDeleteApiRequestQuery = never
export type StatementDeleteApiRequestBody = never
export type StatementDeleteApiRequest = StatementRequireRequestFields<
  StatementApiRequest<StatementDeleteApiRequestPath, StatementDeleteApiRequestQuery, StatementDeleteApiRequestBody>,
  'path'
>
export type StatementDeleteApiResponse = StatementApiResponseBase
