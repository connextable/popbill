import type { FaxApiRequest, FaxRequireRequestFields } from '../common'

/** Raw fax results contract.
 * @see https://developers.popbill.com/api-reference/fax/api/info
 */
export interface FaxGetFaxResultApiRequestPath {
  receiptNum: string
}
export type FaxGetFaxResultApiRequestBody = never
export type FaxGetFaxResultApiRequest = FaxRequireRequestFields<FaxApiRequest<FaxGetFaxResultApiRequestPath, never, never>, 'path'>
export type FaxGetFaxResultApiResponse = FaxResultApiModel[]
import type { FaxResultApiModel } from '../models'
