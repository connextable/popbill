import type { TaxInvoiceApiRequest, TaxInvoiceApiResponseBase } from '../common'

/**
 * TaxInvoice CheckCertValidation Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/cert#CheckCertValidation
 */

/**
 * CheckCertValidation API path 파라미터.
 */
export type TaxInvoiceCheckCertValidationApiRequestPath = never

/**
 * CheckCertValidation API query 파라미터.
 */
export type TaxInvoiceCheckCertValidationApiRequestQuery = never

/**
 * CheckCertValidation API body.
 */
export type TaxInvoiceCheckCertValidationApiRequestBody = never

/**
 * CheckCertValidation API 요청(raw).
 */
export type TaxInvoiceCheckCertValidationApiRequest = TaxInvoiceApiRequest<
  TaxInvoiceCheckCertValidationApiRequestPath,
  TaxInvoiceCheckCertValidationApiRequestQuery,
  TaxInvoiceCheckCertValidationApiRequestBody
>

export type TaxInvoiceCheckCertValidationApiResponse = TaxInvoiceApiResponseBase
