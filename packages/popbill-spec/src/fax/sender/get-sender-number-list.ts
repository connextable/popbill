import type { FaxApiRequest, FaxRequireRequestFields } from '../common'

/** Raw sender numbers contract.
 * @see https://developers.popbill.com/api-reference/fax/api/sendnum
 */
export type FaxGetSenderNumberListApiRequestBody = never
export type FaxGetSenderNumberListApiRequest = FaxRequireRequestFields<FaxApiRequest<never, never, never>, never>
export type FaxGetSenderNumberListApiResponse = FaxSenderNumberApiModel[]
import type { FaxSenderNumberApiModel } from '../models'
