import type { FaxApiRequest, FaxRequireRequestFields, FaxApiResponseBase } from '../common'

/** Raw sender-number registration contract.
 * @see https://developers.popbill.com/api-reference/fax/api/sendnum
 */
export interface FaxCheckSenderNumberApiRequestPath {
  senderNumber: string
}
export type FaxCheckSenderNumberApiRequestBody = never
export type FaxCheckSenderNumberApiRequest = FaxRequireRequestFields<FaxApiRequest<FaxCheckSenderNumberApiRequestPath, never, never>, 'path'>
export type FaxCheckSenderNumberApiResponse = FaxApiResponseBase
