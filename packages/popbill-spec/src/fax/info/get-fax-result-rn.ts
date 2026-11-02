import type { FaxApiRequest, FaxRequireRequestFields } from '../common'

/** Raw fax results by request contract.
 * @see https://developers.popbill.com/api-reference/fax/api/info
 */
export interface FaxGetFaxResultRNApiRequestPath {
  requestNum: string
}
export type FaxGetFaxResultRNApiRequestBody = never
export type FaxGetFaxResultRNApiRequest = FaxRequireRequestFields<FaxApiRequest<FaxGetFaxResultRNApiRequestPath, never, never>, 'path'>
export type FaxGetFaxResultRNApiResponse = FaxResultApiModel[]
import type { FaxResultApiModel } from '../models'
