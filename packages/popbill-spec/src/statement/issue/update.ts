import type { StatementApiRequest, StatementApiResponseBase, StatementDocumentApiRequestPath, StatementRequireRequestFields } from '../common'
import type { StatementApiModel } from '../models'

/**
 * 전자명세서 수정 API(raw).
 * @see https://developers.popbill.com/api-reference/statement/api/issue#Update
 */
export type StatementUpdateApiRequestPath = StatementDocumentApiRequestPath
export type StatementUpdateApiRequestQuery = never
export type StatementUpdateApiRequestBody = StatementApiModel
export type StatementUpdateApiRequest = StatementRequireRequestFields<
  StatementApiRequest<StatementUpdateApiRequestPath, StatementUpdateApiRequestQuery, StatementUpdateApiRequestBody>,
  'path' | 'body'
>
export type StatementUpdateApiResponse = StatementApiResponseBase
