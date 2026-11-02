import type { StatementApiRequest, StatementApiResponseBase, StatementDocumentApiRequestPath, StatementRequireRequestFields } from '../common'

/**
 * 전자명세서 발행취소 API(raw).
 * @see https://developers.popbill.com/api-reference/statement/api/issue#Cancel
 */
export type StatementCancelApiRequestPath = StatementDocumentApiRequestPath
export type StatementCancelApiRequestQuery = never
export interface StatementCancelApiRequestBody {
  memo?: string
}
export type StatementCancelApiRequest = StatementRequireRequestFields<
  StatementApiRequest<StatementCancelApiRequestPath, StatementCancelApiRequestQuery, StatementCancelApiRequestBody>,
  'path'
>
export type StatementCancelApiResponse = StatementApiResponseBase
