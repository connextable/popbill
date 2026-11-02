import type { FaxApiRequest, FaxRequireRequestFields, FaxReceiptApiResponse } from '../common'
import type { FaxSendApiModel, FaxBinaryFileApiModel } from '../models'

/** Raw fax upload contract.
 * @see https://developers.popbill.com/api-reference/fax/api/send
 */
export interface FaxSendFaxApiRequestBody {
  form: FaxSendApiModel
  file: FaxBinaryFileApiModel[]
}
export type FaxSendFaxApiRequest = FaxRequireRequestFields<FaxApiRequest<never, never, FaxSendFaxApiRequestBody>, 'body'>
export type FaxSendFaxApiResponse = FaxReceiptApiResponse
