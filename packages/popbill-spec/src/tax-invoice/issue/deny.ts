import type { TaxInvoiceApiRequest, TaxInvoiceApiResponseBase, TaxInvoiceRequireRequestFields } from '../common'
import type { TaxInvoiceSendApiRequestPath } from './send'

export type TaxInvoiceDenyApiRequestPath = TaxInvoiceSendApiRequestPath
export interface TaxInvoiceDenyApiRequestBody {
  memo?: string
}
/** Legacy SDK DENY 계약. 현행 한국어 API 문서에는 공개되지 않는다. */
export type TaxInvoiceDenyApiRequest = TaxInvoiceRequireRequestFields<
  TaxInvoiceApiRequest<TaxInvoiceDenyApiRequestPath, never, TaxInvoiceDenyApiRequestBody>,
  'path'
>
export type TaxInvoiceDenyApiResponse = TaxInvoiceApiResponseBase
