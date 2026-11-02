import type { HomeTaxTaxInvoiceApiRequest, HomeTaxTaxInvoiceRequireRequestFields, HomeTaxTaxInvoiceDocumentApiRequestPath } from '../common'
import type { HomeTaxTaxInvoiceXmlApiResponse } from '../models'

/** @see https://developers.popbill.com/api-reference/httaxinvoice/api/search */
export type HomeTaxTaxInvoiceGetXmlApiRequestPath = HomeTaxTaxInvoiceDocumentApiRequestPath
export type HomeTaxTaxInvoiceGetXmlApiRequestQuery = { T: 'xml' }
export type HomeTaxTaxInvoiceGetXmlApiRequestBody = never
export type HomeTaxTaxInvoiceGetXmlApiRequest = HomeTaxTaxInvoiceRequireRequestFields<
  HomeTaxTaxInvoiceApiRequest<HomeTaxTaxInvoiceGetXmlApiRequestPath, HomeTaxTaxInvoiceGetXmlApiRequestQuery, HomeTaxTaxInvoiceGetXmlApiRequestBody>,
  'path' | 'query'
>
export type HomeTaxTaxInvoiceGetXmlApiResponse = HomeTaxTaxInvoiceXmlApiResponse
