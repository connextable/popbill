import type {
  HomeTaxTaxInvoiceApiRequest,
  HomeTaxTaxInvoiceRequireRequestFields,
  HomeTaxTaxInvoiceJobApiRequestPath,
  HomeTaxTaxInvoiceFilterApiRequestQuery,
} from '../common'
import type { HomeTaxTaxInvoiceTotalsApiModel } from '../models'

/** @see https://developers.popbill.com/api-reference/httaxinvoice/api/search */
export type HomeTaxTaxInvoiceSummaryApiRequestPath = HomeTaxTaxInvoiceJobApiRequestPath
export type HomeTaxTaxInvoiceSummaryApiRequestQuery = HomeTaxTaxInvoiceFilterApiRequestQuery
export type HomeTaxTaxInvoiceSummaryApiRequestBody = never
export type HomeTaxTaxInvoiceSummaryApiRequest = HomeTaxTaxInvoiceRequireRequestFields<
  HomeTaxTaxInvoiceApiRequest<
    HomeTaxTaxInvoiceSummaryApiRequestPath,
    HomeTaxTaxInvoiceSummaryApiRequestQuery,
    HomeTaxTaxInvoiceSummaryApiRequestBody
  >,
  'path'
>
export type HomeTaxTaxInvoiceSummaryApiResponse = HomeTaxTaxInvoiceTotalsApiModel
