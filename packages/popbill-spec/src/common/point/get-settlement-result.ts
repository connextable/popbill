import type { CommonApiRequest, CommonRequireRequestFields } from '../common'
import type { CommonPaymentHistoryApiModel } from '../models'

/** @see https://developers.popbill.com/api-reference/taxinvoice/common-api/point */
export type CommonGetSettlementResultApiRequestPath = { settleCode: string }
export type CommonGetSettlementResultApiRequestQuery = never
export type CommonGetSettlementResultApiRequestBody = never
export type CommonGetSettlementResultApiRequest = CommonRequireRequestFields<
  CommonApiRequest<CommonGetSettlementResultApiRequestPath, CommonGetSettlementResultApiRequestQuery, CommonGetSettlementResultApiRequestBody>,
  'path'
>
export type CommonGetSettlementResultApiResponse = CommonPaymentHistoryApiModel
