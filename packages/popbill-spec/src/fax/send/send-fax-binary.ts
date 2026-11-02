import type { FaxApiRequest, FaxRequireRequestFields, FaxReceiptApiResponse } from '../common'
import type { FaxSendApiModel, FaxBinaryFileApiModel } from '../models'

/** Raw binary fax upload contract.
 * @see https://developers.popbill.com/api-reference/fax/api/send
 */
export interface FaxSendFaxBinaryApiRequestBody {
  form: FaxSendApiModel
  file: FaxBinaryFileApiModel[]
}
export type FaxSendFaxBinaryApiRequest = FaxRequireRequestFields<FaxApiRequest<never, never, FaxSendFaxBinaryApiRequestBody>, 'body'>
export type FaxSendFaxBinaryApiResponse = FaxReceiptApiResponse
