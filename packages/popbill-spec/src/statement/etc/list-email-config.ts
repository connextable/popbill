import type { StatementApiRequest } from '../common'
import type { StatementEmailConfigApiModel } from '../models'

/**
 * 전자명세서 메일 전송설정 목록조회 API(raw).
 * @see https://developers.popbill.com/api-reference/statement/api/etc#ListEmailConfig
 */
export type StatementListEmailConfigApiRequestPath = never
export type StatementListEmailConfigApiRequestQuery = never
export type StatementListEmailConfigApiRequestBody = never
export type StatementListEmailConfigApiRequest = StatementApiRequest
export type StatementListEmailConfigApiResponse = StatementEmailConfigApiModel[]
