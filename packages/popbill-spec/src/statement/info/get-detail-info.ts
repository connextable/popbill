import type { StatementApiRequest, StatementDocumentApiRequestPath, StatementRequireRequestFields } from '../common'
import type { StatementApiModel } from '../models'

/**
 * 전자명세서 상세조회 API(raw).
 * @see https://developers.popbill.com/api-reference/statement/api/info#GetDetailInfo
 */
export type StatementGetDetailInfoApiRequestPath = StatementDocumentApiRequestPath
export interface StatementGetDetailInfoApiRequestQuery {
  Detail: ''
}
export type StatementGetDetailInfoApiRequestBody = never
export type StatementGetDetailInfoApiRequest = StatementRequireRequestFields<
  StatementApiRequest<StatementGetDetailInfoApiRequestPath, StatementGetDetailInfoApiRequestQuery, StatementGetDetailInfoApiRequestBody>,
  'path' | 'query'
>
export type StatementGetDetailInfoApiResponse = StatementApiModel
