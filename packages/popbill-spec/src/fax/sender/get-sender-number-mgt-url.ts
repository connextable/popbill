import type { FaxApiRequest, FaxRequireRequestFields, FaxUrlApiResponse } from '../common'

/** Raw sender-number registration URL contract.
 * @see https://developers.popbill.com/api-reference/fax/api/sendnum
 */
export interface FaxGetSenderNumberMgtURLApiRequestQuery {
  TG: 'SENDER'
}
export type FaxGetSenderNumberMgtURLApiRequestBody = never
export type FaxGetSenderNumberMgtURLApiRequest = FaxRequireRequestFields<
  FaxApiRequest<never, FaxGetSenderNumberMgtURLApiRequestQuery, never>,
  'query'
>
export type FaxGetSenderNumberMgtURLApiResponse = FaxUrlApiResponse
