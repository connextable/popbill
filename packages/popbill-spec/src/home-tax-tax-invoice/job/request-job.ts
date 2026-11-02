import type {
  HomeTaxTaxInvoiceApiRequest,
  HomeTaxTaxInvoiceRequireRequestFields,
  HomeTaxTaxInvoiceQueryType,
  HomeTaxTaxInvoiceDateType,
} from '../common'

/** @see https://developers.popbill.com/api-reference/httaxinvoice/api/job */
export type HomeTaxTaxInvoiceRequestJobApiRequestPath = { QueryType: HomeTaxTaxInvoiceQueryType }
export type HomeTaxTaxInvoiceRequestJobApiRequestQuery = { SDate: string; EDate: string; DType: HomeTaxTaxInvoiceDateType }
export type HomeTaxTaxInvoiceRequestJobApiRequestBody = never
export type HomeTaxTaxInvoiceRequestJobApiRequest = HomeTaxTaxInvoiceRequireRequestFields<
  HomeTaxTaxInvoiceApiRequest<
    HomeTaxTaxInvoiceRequestJobApiRequestPath,
    HomeTaxTaxInvoiceRequestJobApiRequestQuery,
    HomeTaxTaxInvoiceRequestJobApiRequestBody
  >,
  'path' | 'query'
>
export type HomeTaxTaxInvoiceRequestJobApiResponse = { jobID: string }
