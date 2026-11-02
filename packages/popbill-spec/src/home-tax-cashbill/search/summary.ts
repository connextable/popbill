import type { HomeTaxCashbillApiRequest, HomeTaxCashbillFilterApiRequestQuery, HomeTaxCashbillJobApiRequestPath } from '../common'
import type { PopbillRequireRequestFields } from '../../request'
/** GET /HomeTax/Cashbill/{jobID}/Summary. */
export type HomeTaxCashbillSummaryApiRequestPath = HomeTaxCashbillJobApiRequestPath
export type HomeTaxCashbillSummaryApiRequestQuery = HomeTaxCashbillFilterApiRequestQuery
export type HomeTaxCashbillSummaryApiRequestBody = never
export type HomeTaxCashbillSummaryApiRequest = PopbillRequireRequestFields<
  HomeTaxCashbillApiRequest<HomeTaxCashbillSummaryApiRequestPath, HomeTaxCashbillSummaryApiRequestQuery>,
  'path'
>
export interface HomeTaxCashbillSummaryApiResponse {
  count: number
  supplyCostTotal: number
  taxTotal: number
  serviceFeeTotal: number
  amountTotal: number
}
