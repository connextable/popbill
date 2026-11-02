import type { StatementApiRequest, StatementItemCode, StatementRequireRequestFields } from '../common'
import type { StatementChargeInfoApiResponse } from '../models'

/**
 * 전자명세서 과금 정보 조회 API(raw).
 * @see https://developers.popbill.com/api-reference/statement/common-api/point#GetChargeInfo
 */
export interface StatementGetChargeInfoApiRequestPath {
  ItemCode: StatementItemCode
}
export type StatementGetChargeInfoApiRequestQuery = never
export type StatementGetChargeInfoApiRequestBody = never
export type StatementGetChargeInfoApiRequest = StatementRequireRequestFields<
  StatementApiRequest<StatementGetChargeInfoApiRequestPath, StatementGetChargeInfoApiRequestQuery, StatementGetChargeInfoApiRequestBody>,
  'path'
>
export type StatementGetChargeInfoApiResponse = StatementChargeInfoApiResponse
