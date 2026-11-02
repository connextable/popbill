import type { HomeTaxTaxInvoiceApiRequest } from '../common'
import type { HomeTaxTaxInvoiceJobStateApiModel } from '../models'

/** @see https://developers.popbill.com/api-reference/httaxinvoice/api/job */
export type HomeTaxTaxInvoiceListActiveJobApiRequestPath = never
export type HomeTaxTaxInvoiceListActiveJobApiRequestQuery = never
export type HomeTaxTaxInvoiceListActiveJobApiRequestBody = never
export type HomeTaxTaxInvoiceListActiveJobApiRequest = HomeTaxTaxInvoiceApiRequest<
  HomeTaxTaxInvoiceListActiveJobApiRequestPath,
  HomeTaxTaxInvoiceListActiveJobApiRequestQuery,
  HomeTaxTaxInvoiceListActiveJobApiRequestBody
>
export type HomeTaxTaxInvoiceListActiveJobApiResponse = HomeTaxTaxInvoiceJobStateApiModel[]
