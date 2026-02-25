import type { TaxInvoiceApiRequest } from '../common'
import type { TaxInvoiceTaxCertInfoApiModel } from '../models'

/**
 * TaxInvoice GetTaxCertInfo Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/cert#GetTaxCertInfo
 */

/**
 * GetTaxCertInfo API path 파라미터.
 */
export type TaxInvoiceGetTaxCertInfoApiRequestPath = never

/**
 * GetTaxCertInfo API query 파라미터.
 */
export type TaxInvoiceGetTaxCertInfoApiRequestQuery = never

/**
 * GetTaxCertInfo API body.
 */
export type TaxInvoiceGetTaxCertInfoApiRequestBody = never

/**
 * GetTaxCertInfo API 요청(raw).
 */
export type TaxInvoiceGetTaxCertInfoApiRequest = TaxInvoiceApiRequest<
  TaxInvoiceGetTaxCertInfoApiRequestPath,
  TaxInvoiceGetTaxCertInfoApiRequestQuery,
  TaxInvoiceGetTaxCertInfoApiRequestBody
>

export type TaxInvoiceGetTaxCertInfoApiResponse = TaxInvoiceTaxCertInfoApiModel
