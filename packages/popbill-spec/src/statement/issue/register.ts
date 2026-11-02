import type { StatementApiRequest, StatementApiResponseBase, StatementRequireRequestFields } from '../common'
import type { StatementApiModel } from '../models'

/**
 * 전자명세서 임시저장 API(raw).
 * @see https://developers.popbill.com/api-reference/statement/api/issue#Register
 */
export type StatementRegisterApiRequestPath = never
export type StatementRegisterApiRequestQuery = never
export type StatementRegisterApiRequestBody = StatementApiModel
export type StatementRegisterApiRequest = StatementRequireRequestFields<
  StatementApiRequest<StatementRegisterApiRequestPath, StatementRegisterApiRequestQuery, StatementRegisterApiRequestBody>,
  'body'
>
export type StatementRegisterApiResponse = StatementApiResponseBase
