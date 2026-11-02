import type { HomeTaxTaxInvoiceApiRequest } from '../common'

/** @see https://developers.popbill.com/api-reference/httaxinvoice/api/cert */
export type HomeTaxTaxInvoiceGetCertificateExpireDateApiRequestPath = never
export type HomeTaxTaxInvoiceGetCertificateExpireDateApiRequestQuery = never
export type HomeTaxTaxInvoiceGetCertificateExpireDateApiRequestBody = never
export type HomeTaxTaxInvoiceGetCertificateExpireDateApiRequest = HomeTaxTaxInvoiceApiRequest<
  HomeTaxTaxInvoiceGetCertificateExpireDateApiRequestPath,
  HomeTaxTaxInvoiceGetCertificateExpireDateApiRequestQuery,
  HomeTaxTaxInvoiceGetCertificateExpireDateApiRequestBody
>
export type HomeTaxTaxInvoiceGetCertificateExpireDateApiResponse = { certificateExpiration: string }
