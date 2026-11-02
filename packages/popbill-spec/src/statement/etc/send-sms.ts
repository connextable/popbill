import type { StatementApiRequest, StatementApiResponseBase, StatementDocumentApiRequestPath, StatementRequireRequestFields } from '../common'

/**
 * 전자명세서 문자 재전송 API(raw).
 * @see https://developers.popbill.com/api-reference/statement/api/etc#SendSMS
 */
export type StatementSendSmsApiRequestPath = StatementDocumentApiRequestPath
export type StatementSendSmsApiRequestQuery = never
export interface StatementSendSmsApiRequestBody {
  sender: string
  receiver: string
  contents: string
}
export type StatementSendSmsApiRequest = StatementRequireRequestFields<
  StatementApiRequest<StatementSendSmsApiRequestPath, StatementSendSmsApiRequestQuery, StatementSendSmsApiRequestBody>,
  'path' | 'body'
>
export type StatementSendSmsApiResponse = StatementApiResponseBase
