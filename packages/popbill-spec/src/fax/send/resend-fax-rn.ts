import type { FaxApiRequest, FaxRequireRequestFields, FaxReceiptApiResponse } from '../common'
import type { FaxResendApiModel } from '../models'

/** Raw fax resend by request contract.
 * @see https://developers.popbill.com/api-reference/fax/api/send
 */
export interface FaxResendFaxRNApiRequestPath {
  orgRequestNum: string
}
export type FaxResendFaxRNApiRequestBody = FaxResendApiModel
export type FaxResendFaxRNApiRequest = FaxRequireRequestFields<FaxApiRequest<FaxResendFaxRNApiRequestPath, never, FaxResendApiModel>, 'path' | 'body'>
export type FaxResendFaxRNApiResponse = FaxReceiptApiResponse
