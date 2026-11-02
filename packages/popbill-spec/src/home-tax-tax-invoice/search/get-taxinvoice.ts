import type { HomeTaxTaxInvoiceApiRequest, HomeTaxTaxInvoiceRequireRequestFields, HomeTaxTaxInvoiceDocumentApiRequestPath } from '../common'
import type { HomeTaxTaxInvoiceApiModel } from '../models'

/** @see https://developers.popbill.com/api-reference/httaxinvoice/api/search */
export type HomeTaxTaxInvoiceGetTaxinvoiceApiRequestPath = HomeTaxTaxInvoiceDocumentApiRequestPath
export type HomeTaxTaxInvoiceGetTaxinvoiceApiRequestQuery = never
export type HomeTaxTaxInvoiceGetTaxinvoiceApiRequestBody = never
export type HomeTaxTaxInvoiceGetTaxinvoiceApiRequest = HomeTaxTaxInvoiceRequireRequestFields<
  HomeTaxTaxInvoiceApiRequest<
    HomeTaxTaxInvoiceGetTaxinvoiceApiRequestPath,
    HomeTaxTaxInvoiceGetTaxinvoiceApiRequestQuery,
    HomeTaxTaxInvoiceGetTaxinvoiceApiRequestBody
  >,
  'path'
>
export type HomeTaxTaxInvoiceGetTaxinvoiceApiResponse = HomeTaxTaxInvoiceApiModel
