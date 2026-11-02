import type { StatementApiRequest, StatementApiResponseBase, StatementDocumentApiRequestPath, StatementRequireRequestFields } from '../common'

/**
 * 전자명세서 발행 API(raw).
 * @see https://developers.popbill.com/api-reference/statement/api/issue#Issue
 */
export type StatementIssueApiRequestPath = StatementDocumentApiRequestPath
export type StatementIssueApiRequestQuery = never
export interface StatementIssueApiRequestBody {
  memo?: string
  emailSubject?: string
}
export type StatementIssueApiRequest = StatementRequireRequestFields<
  StatementApiRequest<StatementIssueApiRequestPath, StatementIssueApiRequestQuery, StatementIssueApiRequestBody>,
  'path'
>
export type StatementIssueApiResponse = StatementApiResponseBase
