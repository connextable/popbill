import type { BizInfoCheckApiRequest } from '../common'

/** GET /BizInfo/UnitCost. @see https://developers.popbill.com/api-reference/bizinfocheck/common-api/point#GetUnitCost */
export type BizInfoCheckGetUnitCostApiRequest = BizInfoCheckApiRequest
export interface BizInfoCheckGetUnitCostApiResponse {
  unitCost: string
}
