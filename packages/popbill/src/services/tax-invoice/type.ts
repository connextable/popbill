import type { TaxInvoiceGetInfoInput, TaxInvoiceInfo } from './api/get-info/type'

export interface TaxInvoiceService {
  getInfo(input: TaxInvoiceGetInfoInput): Promise<TaxInvoiceInfo>
}
