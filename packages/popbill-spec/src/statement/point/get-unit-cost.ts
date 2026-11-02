import type { StatementApiRequest, StatementItemCode, StatementRequireRequestFields } from '../common'

/**
 * 전자명세서 발행단가 조회 API(raw).
 * @see https://developers.popbill.com/api-reference/statement/common-api/point#GetUnitCost
 */
export interface StatementGetUnitCostApiRequestPath {
  ItemCode: StatementItemCode
}
export interface StatementGetUnitCostApiRequestQuery {
  cfg: 'UNITCOST'
}
export type StatementGetUnitCostApiRequestBody = never
export type StatementGetUnitCostApiRequest = StatementRequireRequestFields<
  StatementApiRequest<StatementGetUnitCostApiRequestPath, StatementGetUnitCostApiRequestQuery, StatementGetUnitCostApiRequestBody>,
  'path' | 'query'
>
export interface StatementGetUnitCostApiResponse {
  unitCost: string
}
