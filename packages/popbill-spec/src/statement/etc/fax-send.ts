import type { StatementApiRequest, StatementRequireRequestFields } from '../common'
import type { StatementApiModel } from '../models'

/**
 * 전자명세서 팩스 즉시전송 API(raw).
 * @see https://developers.popbill.com/api-reference/statement/api/etc#FAXSend
 */
export type StatementFaxSendApiRequestPath = never
export type StatementFaxSendApiRequestQuery = never
export type StatementFaxSendApiRequestBody = StatementApiModel & { sendNum: string; receiveNum: string }
export type StatementFaxSendApiRequest = StatementRequireRequestFields<
  StatementApiRequest<StatementFaxSendApiRequestPath, StatementFaxSendApiRequestQuery, StatementFaxSendApiRequestBody>,
  'body'
>
export interface StatementFaxSendApiResponse {
  receiptNum: string
}
