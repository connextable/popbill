import type { StatementApiRequest, StatementItemCode, StatementRequireRequestFields, StatementUrlApiResponse } from '../common'

/**
 * 전자명세서 대량 인쇄 URL 조회 API(raw).
 * @see https://developers.popbill.com/api-reference/statement/api/view#GetMassPrintURL
 */
export interface StatementGetMassPrintUrlApiRequestPath {
  ItemCode: StatementItemCode
}
/** 이름만 있는 Print query flag로 요청한다. */
export interface StatementGetMassPrintUrlApiRequestQuery {
  Print: ''
}
export type StatementGetMassPrintUrlApiRequestBody = string[]
export type StatementGetMassPrintUrlApiRequest = StatementRequireRequestFields<
  StatementApiRequest<StatementGetMassPrintUrlApiRequestPath, StatementGetMassPrintUrlApiRequestQuery, StatementGetMassPrintUrlApiRequestBody>,
  'path' | 'query' | 'body'
>
export type StatementGetMassPrintUrlApiResponse = StatementUrlApiResponse
