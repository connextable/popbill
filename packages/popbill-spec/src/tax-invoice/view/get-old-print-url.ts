import type { TaxInvoiceApiRequest, TaxInvoiceRequireRequestFields } from '../common'
import type { TaxInvoiceGetPdfUrlApiRequestPath } from './get-pdf-url'

export type TaxInvoiceGetOldPrintUrlApiRequestPath = TaxInvoiceGetPdfUrlApiRequestPath
export interface TaxInvoiceGetOldPrintUrlApiRequestQuery {
  TG: 'PRINTOLD'
}
/** Legacy SDK PRINTOLD 계약. 현대 서비스에는 노출하지 않는다. */
export type TaxInvoiceGetOldPrintUrlApiRequest = TaxInvoiceRequireRequestFields<
  TaxInvoiceApiRequest<TaxInvoiceGetOldPrintUrlApiRequestPath, TaxInvoiceGetOldPrintUrlApiRequestQuery>,
  'path' | 'query'
>
export interface TaxInvoiceGetOldPrintUrlApiResponse {
  url: string
}
