import type {
  HomeTaxTaxInvoiceApiRequest,
  HomeTaxTaxInvoiceRequireRequestFields,
  HomeTaxTaxInvoiceJobApiRequestPath,
  HomeTaxTaxInvoiceFilterApiRequestQuery,
} from '../common'
import type { HomeTaxTaxInvoiceSearchResultApiModel } from '../models'

/** @see https://developers.popbill.com/api-reference/httaxinvoice/api/search */
export type HomeTaxTaxInvoiceSearchApiRequestPath = HomeTaxTaxInvoiceJobApiRequestPath
export type HomeTaxTaxInvoiceSearchApiRequestQuery = HomeTaxTaxInvoiceFilterApiRequestQuery & {
  Order?: 'A' | 'D' | (string & {})
  Page?: number
  PerPage?: number
}
export type HomeTaxTaxInvoiceSearchApiRequestBody = never
export type HomeTaxTaxInvoiceSearchApiRequest = HomeTaxTaxInvoiceRequireRequestFields<
  HomeTaxTaxInvoiceApiRequest<HomeTaxTaxInvoiceSearchApiRequestPath, HomeTaxTaxInvoiceSearchApiRequestQuery, HomeTaxTaxInvoiceSearchApiRequestBody>,
  'path'
>
export type HomeTaxTaxInvoiceSearchApiResponse = HomeTaxTaxInvoiceSearchResultApiModel
