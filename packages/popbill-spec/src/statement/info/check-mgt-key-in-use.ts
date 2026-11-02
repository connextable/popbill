import type { StatementGetInfoApiRequest, StatementGetInfoApiRequestPath, StatementGetInfoApiResponse } from './get-info'

/**
 * 동일한 단건 조회 응답의 itemKey 존재 여부로 사용 여부를 판단한다.
 * @see https://developers.popbill.com/api-reference/statement/api/info#CheckMgtKeyInUse
 */
export type StatementCheckMgtKeyInUseApiRequestPath = StatementGetInfoApiRequestPath
export type StatementCheckMgtKeyInUseApiRequestQuery = never
export type StatementCheckMgtKeyInUseApiRequestBody = never
export type StatementCheckMgtKeyInUseApiRequest = StatementGetInfoApiRequest
export type StatementCheckMgtKeyInUseApiResponse = StatementGetInfoApiResponse
