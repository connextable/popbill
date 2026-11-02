import type { StatementApiRequest, StatementApiResponseBase, StatementRequireRequestFields } from '../common'
import type { StatementApiModel } from '../models'

/**
 * 전자명세서 즉시발행 API(raw).
 * @see https://developers.popbill.com/api-reference/statement/api/issue#RegistIssue
 */
export type StatementRegistIssueApiRequestPath = never
export type StatementRegistIssueApiRequestQuery = never
export type StatementRegistIssueApiRequestBody = StatementApiModel & { memo?: string; emailSubject?: string }
export type StatementRegistIssueApiRequest = StatementRequireRequestFields<
  StatementApiRequest<StatementRegistIssueApiRequestPath, StatementRegistIssueApiRequestQuery, StatementRegistIssueApiRequestBody>,
  'body'
>
export interface StatementRegistIssueApiResponse extends StatementApiResponseBase {
  invoiceNum?: string
  issueDT?: string
}
