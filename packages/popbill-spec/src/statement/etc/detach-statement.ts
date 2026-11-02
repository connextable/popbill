import type { StatementApiResponseBase } from '../common'
import type {
  StatementAttachStatementApiRequest,
  StatementAttachStatementApiRequestBody,
  StatementAttachStatementApiRequestPath,
} from './attach-statement'

/**
 * 전자명세서 첨부 해제 API(raw).
 * @see https://developers.popbill.com/api-reference/statement/api/etc#DetachStatement
 */
export type StatementDetachStatementApiRequestPath = StatementAttachStatementApiRequestPath
export type StatementDetachStatementApiRequestQuery = never
export type StatementDetachStatementApiRequestBody = StatementAttachStatementApiRequestBody
export type StatementDetachStatementApiRequest = StatementAttachStatementApiRequest
export type StatementDetachStatementApiResponse = StatementApiResponseBase
