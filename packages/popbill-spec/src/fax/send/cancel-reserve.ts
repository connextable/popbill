import type { FaxApiRequest, FaxRequireRequestFields, FaxApiResponseBase } from '../common'

/** Raw fax reservation cancellation contract.
 * @see https://developers.popbill.com/api-reference/fax/api/send
 */
export interface FaxCancelReserveApiRequestPath {
  receiptNum: string
}
export type FaxCancelReserveApiRequestBody = never
export type FaxCancelReserveApiRequest = FaxRequireRequestFields<FaxApiRequest<FaxCancelReserveApiRequestPath, never, never>, 'path'>
export type FaxCancelReserveApiResponse = FaxApiResponseBase
