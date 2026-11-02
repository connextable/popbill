import type { CashbillApiRequest, CashbillApiResponseBase, CashbillEmailType, CashbillRequireRequestFields } from '../common'

export type CashbillUpdateEmailConfigApiRequestPath = never
export interface CashbillUpdateEmailConfigApiRequestQuery {
  EmailType: CashbillEmailType
  SendYN: boolean
}
export type CashbillUpdateEmailConfigApiRequestBody = never
export type CashbillUpdateEmailConfigApiRequest = CashbillRequireRequestFields<
  CashbillApiRequest<never, CashbillUpdateEmailConfigApiRequestQuery>,
  'query'
>
export type CashbillUpdateEmailConfigApiResponse = CashbillApiResponseBase
