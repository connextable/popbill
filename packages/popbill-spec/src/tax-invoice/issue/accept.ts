import type { TaxInvoiceApiRequest, TaxInvoiceApiResponseBase, TaxInvoiceRequireRequestFields } from '../common'
import type { TaxInvoiceSendApiRequestPath } from './send'

export type TaxInvoiceAcceptApiRequestPath = TaxInvoiceSendApiRequestPath
export interface TaxInvoiceAcceptApiRequestBody {
  memo?: string
}
/** Legacy SDK ACCEPT 계약. 현행 한국어 API 문서에는 공개되지 않는다. */
export type TaxInvoiceAcceptApiRequest = TaxInvoiceRequireRequestFields<
  TaxInvoiceApiRequest<TaxInvoiceAcceptApiRequestPath, never, TaxInvoiceAcceptApiRequestBody>,
  'path'
>
export type TaxInvoiceAcceptApiResponse = TaxInvoiceApiResponseBase
