import type { HomeTaxTaxInvoiceApiRequest, HomeTaxTaxInvoiceRequireRequestFields, HomeTaxTaxInvoiceUrlApiResponse } from '../common'

/** @see https://developers.popbill.com/api-reference/httaxinvoice/common-api/point */
export type HomeTaxTaxInvoiceGetFlatRatePopupUrlApiRequestPath = never
export type HomeTaxTaxInvoiceGetFlatRatePopupUrlApiRequestQuery = { TG: 'CHRG' }
export type HomeTaxTaxInvoiceGetFlatRatePopupUrlApiRequestBody = never
export type HomeTaxTaxInvoiceGetFlatRatePopupUrlApiRequest = HomeTaxTaxInvoiceRequireRequestFields<
  HomeTaxTaxInvoiceApiRequest<
    HomeTaxTaxInvoiceGetFlatRatePopupUrlApiRequestPath,
    HomeTaxTaxInvoiceGetFlatRatePopupUrlApiRequestQuery,
    HomeTaxTaxInvoiceGetFlatRatePopupUrlApiRequestBody
  >,
  'query'
>
export type HomeTaxTaxInvoiceGetFlatRatePopupUrlApiResponse = HomeTaxTaxInvoiceUrlApiResponse
