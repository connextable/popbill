import type { FaxApiRequest, FaxRequireRequestFields, FaxReceiptApiResponse } from '../common'
import type { FaxResendApiModel } from '../models'

/** Raw fax resend by receipt contract.
 * @see https://developers.popbill.com/api-reference/fax/api/send
 */
export interface FaxResendFaxApiRequestPath {
  receiptNum: string
}
export type FaxResendFaxApiRequestBody = FaxResendApiModel
export type FaxResendFaxApiRequest = FaxRequireRequestFields<FaxApiRequest<FaxResendFaxApiRequestPath, never, FaxResendApiModel>, 'path' | 'body'>
export type FaxResendFaxApiResponse = FaxReceiptApiResponse
