import type { FaxApiRequest, FaxRequireRequestFields, FaxSortOrder } from '../common'
import type { FaxSearchResultApiModel } from '../models'

/** Raw fax search contract.
 * @see https://developers.popbill.com/api-reference/fax/api/info
 */
export interface FaxSearchApiRequestQuery {
  SDate: string
  EDate: string
  State?: string
  ReserveYN?: boolean
  SenderOnly?: boolean
  QString?: string
  Order?: FaxSortOrder
  Page?: number
  PerPage?: number
}
export type FaxSearchApiRequestBody = never
export type FaxSearchApiRequest = FaxRequireRequestFields<FaxApiRequest<never, FaxSearchApiRequestQuery, never>, 'query'>
export type FaxSearchApiResponse = FaxSearchResultApiModel
