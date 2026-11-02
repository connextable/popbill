import type { HomeTaxCashbillApiRequest, HomeTaxCashbillJobApiRequestPath } from '../common'
import type { HomeTaxCashbillJobStateApiModel } from '../models'
import type { PopbillRequireRequestFields } from '../../request'
/** GET /HomeTax/Cashbill/{jobID}/State. */
export type HomeTaxCashbillGetJobStateApiRequestPath = HomeTaxCashbillJobApiRequestPath
export type HomeTaxCashbillGetJobStateApiRequestQuery = never
export type HomeTaxCashbillGetJobStateApiRequestBody = never
export type HomeTaxCashbillGetJobStateApiRequest = PopbillRequireRequestFields<
  HomeTaxCashbillApiRequest<HomeTaxCashbillGetJobStateApiRequestPath>,
  'path'
>
export type HomeTaxCashbillGetJobStateApiResponse = HomeTaxCashbillJobStateApiModel
