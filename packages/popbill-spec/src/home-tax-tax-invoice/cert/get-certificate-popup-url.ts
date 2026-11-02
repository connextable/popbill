import type { HomeTaxTaxInvoiceApiRequest, HomeTaxTaxInvoiceRequireRequestFields, HomeTaxTaxInvoiceUrlApiResponse } from '../common'

/** @see https://developers.popbill.com/api-reference/httaxinvoice/api/cert */
export type HomeTaxTaxInvoiceGetCertificatePopupUrlApiRequestPath = never
export type HomeTaxTaxInvoiceGetCertificatePopupUrlApiRequestQuery = { TG: 'CERT' }
export type HomeTaxTaxInvoiceGetCertificatePopupUrlApiRequestBody = never
export type HomeTaxTaxInvoiceGetCertificatePopupUrlApiRequest = HomeTaxTaxInvoiceRequireRequestFields<
  HomeTaxTaxInvoiceApiRequest<
    HomeTaxTaxInvoiceGetCertificatePopupUrlApiRequestPath,
    HomeTaxTaxInvoiceGetCertificatePopupUrlApiRequestQuery,
    HomeTaxTaxInvoiceGetCertificatePopupUrlApiRequestBody
  >,
  'query'
>
export type HomeTaxTaxInvoiceGetCertificatePopupUrlApiResponse = HomeTaxTaxInvoiceUrlApiResponse
