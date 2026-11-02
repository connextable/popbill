import type { FaxApiRequest, FaxRequireRequestFields, FaxGetUrlTogo, FaxUrlApiResponse } from '../common'

/** Raw fax screen contract.
 * @see https://developers.popbill.com/api-reference/fax/api/info
 */
export interface FaxGetURLApiRequestQuery {
  TG: FaxGetUrlTogo
}
export type FaxGetURLApiRequestBody = never
export type FaxGetURLApiRequest = FaxRequireRequestFields<FaxApiRequest<never, FaxGetURLApiRequestQuery, never>, 'query'>
export type FaxGetURLApiResponse = FaxUrlApiResponse
