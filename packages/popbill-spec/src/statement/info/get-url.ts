import type { StatementApiRequest, StatementGetUrlTogo, StatementRequireRequestFields } from '../common'

/**
 * Legacy SDK의 문서함 URL 조회(raw).
 * @see https://developers.popbill.com/api-reference/statement/api/info#GetURL
 */
export type StatementGetUrlApiRequestPath = never
export interface StatementGetUrlApiRequestQuery {
  TG: StatementGetUrlTogo
}
export type StatementGetUrlApiRequestBody = never
export type StatementGetUrlApiRequest = StatementRequireRequestFields<
  StatementApiRequest<StatementGetUrlApiRequestPath, StatementGetUrlApiRequestQuery, StatementGetUrlApiRequestBody>,
  'query'
>
export interface StatementGetUrlApiResponse {
  url: string
}
