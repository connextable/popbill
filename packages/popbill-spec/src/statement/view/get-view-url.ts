import type { StatementApiRequest, StatementDocumentApiRequestPath, StatementRequireRequestFields, StatementUrlApiResponse } from '../common'

/**
 * 전자명세서 보기 URL 조회 API(raw).
 * @see https://developers.popbill.com/api-reference/statement/api/view#GetViewURL
 */
export type StatementGetViewUrlApiRequestPath = StatementDocumentApiRequestPath
export interface StatementGetViewUrlApiRequestQuery {
  TG: 'VIEW'
}
export type StatementGetViewUrlApiRequestBody = never
export type StatementGetViewUrlApiRequest = StatementRequireRequestFields<
  StatementApiRequest<StatementGetViewUrlApiRequestPath, StatementGetViewUrlApiRequestQuery, StatementGetViewUrlApiRequestBody>,
  'path' | 'query'
>
export type StatementGetViewUrlApiResponse = StatementUrlApiResponse
