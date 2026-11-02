import type { StatementApiRequest, StatementApiResponseBase, StatementDocumentApiRequestPath, StatementRequireRequestFields } from '../common'

/**
 * 전자명세서 메일 재전송 API(raw).
 * @see https://developers.popbill.com/api-reference/statement/api/etc#SendEmail
 */
export type StatementSendEmailApiRequestPath = StatementDocumentApiRequestPath
export type StatementSendEmailApiRequestQuery = never
export interface StatementSendEmailApiRequestBody {
  receiver: string
}
export type StatementSendEmailApiRequest = StatementRequireRequestFields<
  StatementApiRequest<StatementSendEmailApiRequestPath, StatementSendEmailApiRequestQuery, StatementSendEmailApiRequestBody>,
  'path' | 'body'
>
export type StatementSendEmailApiResponse = StatementApiResponseBase
