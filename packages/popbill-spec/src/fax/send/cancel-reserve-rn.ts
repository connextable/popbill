import type { FaxApiRequest, FaxRequireRequestFields, FaxApiResponseBase } from '../common'

/** Raw fax reservation cancellation by request contract.
 * @see https://developers.popbill.com/api-reference/fax/api/send
 */
export interface FaxCancelReserveRNApiRequestPath {
  requestNum: string
}
export type FaxCancelReserveRNApiRequestBody = never
export type FaxCancelReserveRNApiRequest = FaxRequireRequestFields<FaxApiRequest<FaxCancelReserveRNApiRequestPath, never, never>, 'path'>
export type FaxCancelReserveRNApiResponse = FaxApiResponseBase
