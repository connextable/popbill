import type { FaxApiRequest, FaxRequireRequestFields, FaxUrlApiResponse } from '../common'

/** Raw fax preview screen contract.
 * @see https://developers.popbill.com/api-reference/fax/api/info
 */
export interface FaxGetPreviewURLApiRequestPath {
  receiptNum: string
}
export type FaxGetPreviewURLApiRequestBody = never
export type FaxGetPreviewURLApiRequest = FaxRequireRequestFields<FaxApiRequest<FaxGetPreviewURLApiRequestPath, never, never>, 'path'>
export type FaxGetPreviewURLApiResponse = FaxUrlApiResponse
