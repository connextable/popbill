import type { TaxInvoiceApiRequest } from '../common'
import type { TaxInvoiceEmailConfigApiModel } from '../models'

/**
 * TaxInvoice ListEmailConfig Raw Spec
 *
 * Source
 * - https://developers.popbill.com/api-reference/taxinvoice/api/etc#ListEmailConfig
 */

/**
 * ListEmailConfig API path 파라미터.
 */
export type TaxInvoiceListEmailConfigApiRequestPath = never

/**
 * ListEmailConfig API query 파라미터.
 */
export type TaxInvoiceListEmailConfigApiRequestQuery = never

/**
 * ListEmailConfig API body.
 */
export type TaxInvoiceListEmailConfigApiRequestBody = never

/**
 * ListEmailConfig API 요청(raw).
 */
export type TaxInvoiceListEmailConfigApiRequest = TaxInvoiceApiRequest<
  TaxInvoiceListEmailConfigApiRequestPath,
  TaxInvoiceListEmailConfigApiRequestQuery,
  TaxInvoiceListEmailConfigApiRequestBody
>

/**
 * ListEmailConfig API 응답(raw).
 */
export type TaxInvoiceListEmailConfigApiResponse = TaxInvoiceEmailConfigApiModel[]
