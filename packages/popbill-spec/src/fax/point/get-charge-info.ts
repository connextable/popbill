import type { FaxApiRequest, FaxReceiveNumberType } from '../common'

/** Raw fax charge info contract.
 * @see https://developers.popbill.com/api-reference/fax/common-api/point
 */
export interface FaxGetChargeInfoApiRequestQuery {
  receiveNumType?: FaxReceiveNumberType
}
export type FaxGetChargeInfoApiRequestBody = never
export type FaxGetChargeInfoApiRequest = FaxApiRequest<never, FaxGetChargeInfoApiRequestQuery, never>
export type FaxGetChargeInfoApiResponse = FaxChargeInfoApiModel
import type { FaxChargeInfoApiModel } from '../models'
