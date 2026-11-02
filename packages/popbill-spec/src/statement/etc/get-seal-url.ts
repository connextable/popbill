import type { StatementApiRequest, StatementRequireRequestFields, StatementUrlApiResponse } from '../common'

/**
 * 전자명세서 인감·사업자 로고 등록 URL 조회 API(raw).
 * @see https://developers.popbill.com/api-reference/statement/api/etc#GetSealURL
 */
export type StatementGetSealUrlApiRequestPath = never
export interface StatementGetSealUrlApiRequestQuery {
  TG: 'SEAL'
}
export type StatementGetSealUrlApiRequestBody = never
export type StatementGetSealUrlApiRequest = StatementRequireRequestFields<
  StatementApiRequest<StatementGetSealUrlApiRequestPath, StatementGetSealUrlApiRequestQuery, StatementGetSealUrlApiRequestBody>,
  'query'
>
export type StatementGetSealUrlApiResponse = StatementUrlApiResponse
