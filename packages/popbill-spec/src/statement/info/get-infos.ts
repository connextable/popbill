import type { StatementApiRequest, StatementItemCode, StatementRequireRequestFields } from '../common'
import type { StatementInfoApiModel } from '../models'

/**
 * 전자명세서 상태 대량조회 API(raw).
 * @see https://developers.popbill.com/api-reference/statement/api/info#GetInfos
 */
export interface StatementGetInfosApiRequestPath {
  ItemCode: StatementItemCode
}
export type StatementGetInfosApiRequestQuery = never
export type StatementGetInfosApiRequestBody = string[]
export type StatementGetInfosApiRequest = StatementRequireRequestFields<
  StatementApiRequest<StatementGetInfosApiRequestPath, StatementGetInfosApiRequestQuery, StatementGetInfosApiRequestBody>,
  'path' | 'body'
>
export type StatementGetInfosApiResponse = StatementInfoApiModel[]
