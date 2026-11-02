import type { StatementApiRequest, StatementDocumentApiRequestPath, StatementRequireRequestFields, StatementUrlApiResponse } from '../common'

/**
 * 전자명세서 메일 보기 URL 조회 API(raw).
 * @see https://developers.popbill.com/api-reference/statement/api/view#GetMailURL
 */
export type StatementGetMailUrlApiRequestPath = StatementDocumentApiRequestPath
export interface StatementGetMailUrlApiRequestQuery {
  TG: 'MAIL'
}
export type StatementGetMailUrlApiRequestBody = never
export type StatementGetMailUrlApiRequest = StatementRequireRequestFields<
  StatementApiRequest<StatementGetMailUrlApiRequestPath, StatementGetMailUrlApiRequestQuery, StatementGetMailUrlApiRequestBody>,
  'path' | 'query'
>
export type StatementGetMailUrlApiResponse = StatementUrlApiResponse
