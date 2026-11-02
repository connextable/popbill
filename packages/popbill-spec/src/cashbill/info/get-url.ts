import type { CashbillApiRequest, CashbillBoxScope, CashbillRequireRequestFields, CashbillUrlApiResponse } from '../common'

export type CashbillGetUrlApiRequestPath = never
export interface CashbillGetUrlApiRequestQuery {
  TG: CashbillBoxScope
}
export type CashbillGetUrlApiRequestBody = never
export type CashbillGetUrlApiRequest = CashbillRequireRequestFields<CashbillApiRequest<never, CashbillGetUrlApiRequestQuery>, 'query'>
export type CashbillGetUrlApiResponse = CashbillUrlApiResponse
