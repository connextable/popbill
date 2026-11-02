import type { CommonApiRequest, CommonRequireRequestFields, CommonPageApiResponse, CommonHistoryApiQuery } from '../common'
import type { CommonPaymentHistoryApiModel } from '../models'

/** @see https://developers.popbill.com/api-reference/taxinvoice/common-api/point */
export type CommonGetPaymentHistoryApiRequestPath = never
export type CommonGetPaymentHistoryApiRequestQuery = CommonHistoryApiQuery
export type CommonGetPaymentHistoryApiRequestBody = never
export type CommonGetPaymentHistoryApiRequest = CommonRequireRequestFields<
  CommonApiRequest<CommonGetPaymentHistoryApiRequestPath, CommonGetPaymentHistoryApiRequestQuery, CommonGetPaymentHistoryApiRequestBody>,
  'query'
>
export type CommonGetPaymentHistoryApiResponse = CommonPageApiResponse<CommonPaymentHistoryApiModel>
