import type { FaxApiRequest, FaxReceiveNumberType } from '../common'

/** Raw fax unit cost contract.
 * @see https://developers.popbill.com/api-reference/fax/common-api/point
 */
export interface FaxGetUnitCostApiRequestQuery {
  receiveNumType?: FaxReceiveNumberType
}
export type FaxGetUnitCostApiRequestBody = never
export type FaxGetUnitCostApiRequest = FaxApiRequest<never, FaxGetUnitCostApiRequestQuery, never>
export type FaxGetUnitCostApiResponse = { unitCost: string }
