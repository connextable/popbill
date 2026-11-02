import type { StatementApiRequest, StatementDocumentApiRequestPath, StatementRequireRequestFields, StatementUrlApiResponse } from '../common'

/**
 * 전자명세서 인쇄 URL 조회 API(raw).
 * @see https://developers.popbill.com/api-reference/statement/api/view#GetPrintURL
 */
export type StatementGetPrintUrlApiRequestPath = StatementDocumentApiRequestPath
export interface StatementGetPrintUrlApiRequestQuery {
  TG: 'PRINT'
}
export type StatementGetPrintUrlApiRequestBody = never
export type StatementGetPrintUrlApiRequest = StatementRequireRequestFields<
  StatementApiRequest<StatementGetPrintUrlApiRequestPath, StatementGetPrintUrlApiRequestQuery, StatementGetPrintUrlApiRequestBody>,
  'path' | 'query'
>
export type StatementGetPrintUrlApiResponse = StatementUrlApiResponse
