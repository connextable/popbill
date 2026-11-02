import type { CommonApiRequest, CommonPageApiResponse, CommonPageApiQuery } from '../common'
import type { CommonRefundHistoryApiModel } from '../models'

/** @see https://developers.popbill.com/api-reference/taxinvoice/common-api/point */
export type CommonGetRefundHistoryApiRequestPath = never
export type CommonGetRefundHistoryApiRequestQuery = CommonPageApiQuery
export type CommonGetRefundHistoryApiRequestBody = never
export type CommonGetRefundHistoryApiRequest = CommonApiRequest<
  CommonGetRefundHistoryApiRequestPath,
  CommonGetRefundHistoryApiRequestQuery,
  CommonGetRefundHistoryApiRequestBody
>
export type CommonGetRefundHistoryApiResponse = CommonPageApiResponse<CommonRefundHistoryApiModel>
