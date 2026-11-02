import type { StatementApiRequest, StatementApiResponseBase, StatementDocumentApiRequestPath, StatementRequireRequestFields } from '../common'

/**
 * 전자명세서 팩스 재전송 API(raw).
 * @see https://developers.popbill.com/api-reference/statement/api/etc#SendFAX
 */
export type StatementSendFaxApiRequestPath = StatementDocumentApiRequestPath
export type StatementSendFaxApiRequestQuery = never
export interface StatementSendFaxApiRequestBody {
  sender: string
  receiver: string
}
export type StatementSendFaxApiRequest = StatementRequireRequestFields<
  StatementApiRequest<StatementSendFaxApiRequestPath, StatementSendFaxApiRequestQuery, StatementSendFaxApiRequestBody>,
  'path' | 'body'
>
export type StatementSendFaxApiResponse = StatementApiResponseBase
