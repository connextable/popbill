import type { HomeTaxTaxInvoiceApiRequest, HomeTaxTaxInvoiceRequireRequestFields, HomeTaxTaxInvoiceApiResponseBase } from '../common'

/** @see https://developers.popbill.com/api-reference/httaxinvoice/api/cert */
export type HomeTaxTaxInvoiceRegistDeptUserApiRequestPath = never
export type HomeTaxTaxInvoiceRegistDeptUserApiRequestQuery = never
export type HomeTaxTaxInvoiceRegistDeptUserApiRequestBody = { id: string; pwd: string; secAuth?: string | null }
export type HomeTaxTaxInvoiceRegistDeptUserApiRequest = HomeTaxTaxInvoiceRequireRequestFields<
  HomeTaxTaxInvoiceApiRequest<
    HomeTaxTaxInvoiceRegistDeptUserApiRequestPath,
    HomeTaxTaxInvoiceRegistDeptUserApiRequestQuery,
    HomeTaxTaxInvoiceRegistDeptUserApiRequestBody
  >,
  'body'
>
export type HomeTaxTaxInvoiceRegistDeptUserApiResponse = HomeTaxTaxInvoiceApiResponseBase
