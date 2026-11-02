import type { StatementApiRequest, StatementDocumentApiRequestPath, StatementRequireRequestFields, StatementUrlApiResponse } from '../common'

/**
 * 전자명세서 보기 팝업 URL 조회 API(raw).
 * @see https://developers.popbill.com/api-reference/statement/api/view#GetPopUpURL
 */
export type StatementGetPopUpUrlApiRequestPath = StatementDocumentApiRequestPath
export interface StatementGetPopUpUrlApiRequestQuery {
  TG: 'POPUP'
}
export type StatementGetPopUpUrlApiRequestBody = never
export type StatementGetPopUpUrlApiRequest = StatementRequireRequestFields<
  StatementApiRequest<StatementGetPopUpUrlApiRequestPath, StatementGetPopUpUrlApiRequestQuery, StatementGetPopUpUrlApiRequestBody>,
  'path' | 'query'
>
export type StatementGetPopUpUrlApiResponse = StatementUrlApiResponse
