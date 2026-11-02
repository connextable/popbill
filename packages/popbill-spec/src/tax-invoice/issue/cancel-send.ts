import type { TaxInvoiceApiRequest, TaxInvoiceApiResponseBase, TaxInvoiceRequireRequestFields } from '../common'
import type { TaxInvoiceSendApiRequestPath } from './send'

export type TaxInvoiceCancelSendApiRequestPath = TaxInvoiceSendApiRequestPath
export interface TaxInvoiceCancelSendApiRequestBody {
  memo?: string
}
/** Legacy SDK CANCELSEND 계약. 서버 지원 여부는 회원별 실서버 확인이 필요하다. */
export type TaxInvoiceCancelSendApiRequest = TaxInvoiceRequireRequestFields<
  TaxInvoiceApiRequest<TaxInvoiceCancelSendApiRequestPath, never, TaxInvoiceCancelSendApiRequestBody>,
  'path'
>
export type TaxInvoiceCancelSendApiResponse = TaxInvoiceApiResponseBase
