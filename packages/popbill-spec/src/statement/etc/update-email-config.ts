import type { StatementApiRequest, StatementApiResponseBase, StatementEmailType, StatementRequireRequestFields } from '../common'

/**
 * 전자명세서 메일 전송설정 수정 API(raw).
 * @see https://developers.popbill.com/api-reference/statement/api/etc#UpdateEmailConfig
 */
export type StatementUpdateEmailConfigApiRequestPath = never
export interface StatementUpdateEmailConfigApiRequestQuery {
  EmailType: StatementEmailType
  SendYN: boolean
}
export type StatementUpdateEmailConfigApiRequestBody = never
export type StatementUpdateEmailConfigApiRequest = StatementRequireRequestFields<
  StatementApiRequest<StatementUpdateEmailConfigApiRequestPath, StatementUpdateEmailConfigApiRequestQuery, StatementUpdateEmailConfigApiRequestBody>,
  'query'
>
export type StatementUpdateEmailConfigApiResponse = StatementApiResponseBase
