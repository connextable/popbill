import type { StatementApiRequest, StatementDocumentApiRequestPath, StatementRequireRequestFields, StatementUrlApiResponse } from '../common'

/**
 * 전자명세서 공급받는자용 인쇄 URL 조회 API(raw).
 * @see https://developers.popbill.com/api-reference/statement/api/view#GetEPrintURL
 */
export type StatementGetEPrintUrlApiRequestPath = StatementDocumentApiRequestPath
export interface StatementGetEPrintUrlApiRequestQuery {
  TG: 'EPRINT'
}
export type StatementGetEPrintUrlApiRequestBody = never
export type StatementGetEPrintUrlApiRequest = StatementRequireRequestFields<
  StatementApiRequest<StatementGetEPrintUrlApiRequestPath, StatementGetEPrintUrlApiRequestQuery, StatementGetEPrintUrlApiRequestBody>,
  'path' | 'query'
>
export type StatementGetEPrintUrlApiResponse = StatementUrlApiResponse
