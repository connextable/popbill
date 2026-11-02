import type { StatementDocumentApiRequestPath } from '../common'
import type { StatementLogApiModel } from '../models'
import type { StatementGetInfoApiRequest } from './get-info'

/**
 * 전자명세서 상태 변경이력 조회 API(raw).
 * @see https://developers.popbill.com/api-reference/statement/api/info#GetLogs
 */
export type StatementGetLogsApiRequestPath = StatementDocumentApiRequestPath
export type StatementGetLogsApiRequestQuery = never
export type StatementGetLogsApiRequestBody = never
export type StatementGetLogsApiRequest = StatementGetInfoApiRequest
export type StatementGetLogsApiResponse = StatementLogApiModel[]
