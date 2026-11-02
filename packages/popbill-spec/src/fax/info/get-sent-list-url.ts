import type { FaxApiRequest, FaxRequireRequestFields, FaxUrlApiResponse } from '../common'

/** Raw sent fax list screen contract.
 * @see https://developers.popbill.com/api-reference/fax/api/info
 */
export interface FaxGetSentListURLApiRequestQuery {
  TG: 'BOX'
}
export type FaxGetSentListURLApiRequestBody = never
export type FaxGetSentListURLApiRequest = FaxRequireRequestFields<FaxApiRequest<never, FaxGetSentListURLApiRequestQuery, never>, 'query'>
export type FaxGetSentListURLApiResponse = FaxUrlApiResponse
