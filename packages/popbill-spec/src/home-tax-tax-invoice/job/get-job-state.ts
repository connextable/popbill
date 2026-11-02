import type { HomeTaxTaxInvoiceApiRequest, HomeTaxTaxInvoiceRequireRequestFields, HomeTaxTaxInvoiceJobApiRequestPath } from '../common'
import type { HomeTaxTaxInvoiceJobStateApiModel } from '../models'

/** @see https://developers.popbill.com/api-reference/httaxinvoice/api/job */
export type HomeTaxTaxInvoiceGetJobStateApiRequestPath = HomeTaxTaxInvoiceJobApiRequestPath
export type HomeTaxTaxInvoiceGetJobStateApiRequestQuery = never
export type HomeTaxTaxInvoiceGetJobStateApiRequestBody = never
export type HomeTaxTaxInvoiceGetJobStateApiRequest = HomeTaxTaxInvoiceRequireRequestFields<
  HomeTaxTaxInvoiceApiRequest<
    HomeTaxTaxInvoiceGetJobStateApiRequestPath,
    HomeTaxTaxInvoiceGetJobStateApiRequestQuery,
    HomeTaxTaxInvoiceGetJobStateApiRequestBody
  >,
  'path'
>
export type HomeTaxTaxInvoiceGetJobStateApiResponse = HomeTaxTaxInvoiceJobStateApiModel
