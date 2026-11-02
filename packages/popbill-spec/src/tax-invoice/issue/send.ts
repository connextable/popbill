import type { TaxInvoiceApiRequest, TaxInvoiceApiResponseBase, TaxInvoiceMgtKeyType, TaxInvoiceRequireRequestFields } from '../common'

export interface TaxInvoiceSendApiRequestPath {
  MgtKeyType: TaxInvoiceMgtKeyType
  MgtKey: string
}

export interface TaxInvoiceSendApiRequestBody {
  memo?: string
  emailSubject?: string
}

/** Legacy SDK SEND 계약. 현행 한국어 API 문서에는 공개되지 않는다. */
export type TaxInvoiceSendApiRequest = TaxInvoiceRequireRequestFields<
  TaxInvoiceApiRequest<TaxInvoiceSendApiRequestPath, never, TaxInvoiceSendApiRequestBody>,
  'path'
>
export type TaxInvoiceSendApiResponse = TaxInvoiceApiResponseBase
