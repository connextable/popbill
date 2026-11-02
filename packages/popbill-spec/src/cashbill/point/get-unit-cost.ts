import type { CashbillApiRequest, CashbillRequireRequestFields } from '../common'

export type CashbillGetUnitCostApiRequestPath = never
export type CashbillGetUnitCostApiRequestQuery = { cfg: 'UNITCOST' }
export type CashbillGetUnitCostApiRequestBody = never
export type CashbillGetUnitCostApiRequest = CashbillRequireRequestFields<CashbillApiRequest<never, CashbillGetUnitCostApiRequestQuery>, 'query'>
export interface CashbillGetUnitCostApiResponse {
  unitCost: string
}
