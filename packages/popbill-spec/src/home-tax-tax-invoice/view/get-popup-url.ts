import type {
  HomeTaxTaxInvoiceApiRequest,
  HomeTaxTaxInvoiceRequireRequestFields,
  HomeTaxTaxInvoiceDocumentApiRequestPath,
  HomeTaxTaxInvoiceUrlApiResponse,
} from '../common'

/** @see https://developers.popbill.com/api-reference/httaxinvoice/api/search */
export type HomeTaxTaxInvoiceGetPopupUrlApiRequestPath = HomeTaxTaxInvoiceDocumentApiRequestPath
export type HomeTaxTaxInvoiceGetPopupUrlApiRequestQuery = never
export type HomeTaxTaxInvoiceGetPopupUrlApiRequestBody = never
export type HomeTaxTaxInvoiceGetPopupUrlApiRequest = HomeTaxTaxInvoiceRequireRequestFields<
  HomeTaxTaxInvoiceApiRequest<
    HomeTaxTaxInvoiceGetPopupUrlApiRequestPath,
    HomeTaxTaxInvoiceGetPopupUrlApiRequestQuery,
    HomeTaxTaxInvoiceGetPopupUrlApiRequestBody
  >,
  'path'
>
export type HomeTaxTaxInvoiceGetPopupUrlApiResponse = HomeTaxTaxInvoiceUrlApiResponse
