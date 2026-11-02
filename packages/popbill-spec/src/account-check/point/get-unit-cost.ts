import type { AccountCheckApiRequest, AccountCheckServiceType } from '../common'

/** GET /EasyFin/AccountCheck/UnitCost. @see https://developers.popbill.com/api-reference/accountcheck/common-api/point#GetUnitCost */
export interface AccountCheckGetUnitCostApiRequestQuery {
  serviceType?: AccountCheckServiceType
}
export type AccountCheckGetUnitCostApiRequest = AccountCheckApiRequest<AccountCheckGetUnitCostApiRequestQuery>
export interface AccountCheckGetUnitCostApiResponse {
  unitCost: string
}
