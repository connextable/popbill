import type { ClosedownApiRequest } from '../common'

/** GET /CloseDown/UnitCost. @see https://developers.popbill.com/api-reference/closedown/common-api/point#GetUnitCost */
export type ClosedownGetUnitCostApiRequest = ClosedownApiRequest
export interface ClosedownGetUnitCostApiResponse {
  unitCost: string
}
