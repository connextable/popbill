import type { PopbillApiRequest, PopbillRequireRequestFields } from '../request'

export type HomeTaxTaxInvoiceApiRequest<TPath = never, TQuery = never, TBody = never> = PopbillApiRequest<TPath, TQuery, TBody>
export type HomeTaxTaxInvoiceRequireRequestFields<T, K extends keyof T> = PopbillRequireRequestFields<T, K>
export type HomeTaxTaxInvoiceQueryType = 'SELL' | 'BUY' | 'TRUSTEE' | (string & {})
export type HomeTaxTaxInvoiceDateType = 'W' | 'I' | 'S' | (string & {})
export type HomeTaxTaxInvoiceDocumentType = 'N' | 'M' | (string & {})
export type HomeTaxTaxInvoiceTaxType = 'T' | 'N' | 'Z' | (string & {})
export type HomeTaxTaxInvoicePurposeType = 'R' | 'C' | 'N' | (string & {})
export type HomeTaxTaxInvoiceTaxRegistrationParty = 'S' | 'B' | 'T' | (string & {})
export interface HomeTaxTaxInvoiceJobApiRequestPath {
  jobID: string
}
export interface HomeTaxTaxInvoiceDocumentApiRequestPath {
  ntsConfirmNum: string
}
export interface HomeTaxTaxInvoiceApiResponseBase {
  code: number
  message: string
}
export interface HomeTaxTaxInvoiceUrlApiResponse {
  url: string
}

/** 다중 선택 필터는 쉼표로 구분합니다. */
export interface HomeTaxTaxInvoiceFilterApiRequestQuery {
  Type?: string
  TaxType?: string
  PurposeType?: string
  TaxRegIDType?: HomeTaxTaxInvoiceTaxRegistrationParty
  TaxRegIDYN?: '0' | '1'
  TaxRegID?: string
  SearchString?: string
}
