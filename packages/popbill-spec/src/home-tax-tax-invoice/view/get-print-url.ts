import type {
  HomeTaxTaxInvoiceApiRequest,
  HomeTaxTaxInvoiceRequireRequestFields,
  HomeTaxTaxInvoiceDocumentApiRequestPath,
  HomeTaxTaxInvoiceUrlApiResponse,
} from '../common'

/** @see https://developers.popbill.com/api-reference/httaxinvoice/api/search */
export type HomeTaxTaxInvoiceGetPrintUrlApiRequestPath = HomeTaxTaxInvoiceDocumentApiRequestPath
export type HomeTaxTaxInvoiceGetPrintUrlApiRequestQuery = never
export type HomeTaxTaxInvoiceGetPrintUrlApiRequestBody = never
export type HomeTaxTaxInvoiceGetPrintUrlApiRequest = HomeTaxTaxInvoiceRequireRequestFields<
  HomeTaxTaxInvoiceApiRequest<
    HomeTaxTaxInvoiceGetPrintUrlApiRequestPath,
    HomeTaxTaxInvoiceGetPrintUrlApiRequestQuery,
    HomeTaxTaxInvoiceGetPrintUrlApiRequestBody
  >,
  'path'
>
export type HomeTaxTaxInvoiceGetPrintUrlApiResponse = HomeTaxTaxInvoiceUrlApiResponse
