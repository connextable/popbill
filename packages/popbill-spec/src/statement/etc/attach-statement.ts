import type {
  StatementApiRequest,
  StatementApiResponseBase,
  StatementDocumentApiRequestPath,
  StatementItemCode,
  StatementRequireRequestFields,
} from '../common'

/**
 * 전자명세서 첨부 API(raw).
 * @see https://developers.popbill.com/api-reference/statement/api/etc#AttachStatement
 */
export type StatementAttachStatementApiRequestPath = StatementDocumentApiRequestPath
export type StatementAttachStatementApiRequestQuery = never
export interface StatementAttachStatementApiRequestBody {
  ItemCode: StatementItemCode
  MgtKey: string
}
export type StatementAttachStatementApiRequest = StatementRequireRequestFields<
  StatementApiRequest<StatementAttachStatementApiRequestPath, StatementAttachStatementApiRequestQuery, StatementAttachStatementApiRequestBody>,
  'path' | 'body'
>
export type StatementAttachStatementApiResponse = StatementApiResponseBase
