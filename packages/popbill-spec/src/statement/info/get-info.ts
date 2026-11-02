import type { StatementApiRequest, StatementDocumentApiRequestPath, StatementRequireRequestFields } from '../common'
import type { StatementInfoApiModel } from '../models'

/**
 * 전자명세서 상태조회 API(raw).
 * @see https://developers.popbill.com/api-reference/statement/api/info#GetInfo
 */
export type StatementGetInfoApiRequestPath = StatementDocumentApiRequestPath
export type StatementGetInfoApiRequestQuery = never
export type StatementGetInfoApiRequestBody = never
export type StatementGetInfoApiRequest = StatementRequireRequestFields<
  StatementApiRequest<StatementGetInfoApiRequestPath, StatementGetInfoApiRequestQuery, StatementGetInfoApiRequestBody>,
  'path'
>
export type StatementGetInfoApiResponse = StatementInfoApiModel
