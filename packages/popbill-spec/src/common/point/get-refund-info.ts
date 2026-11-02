import type { CommonApiRequest, CommonRequireRequestFields } from '../common'
import type { CommonRefundHistoryApiModel } from '../models'

/** @see https://developers.popbill.com/api-reference/taxinvoice/common-api/point */
export type CommonGetRefundInfoApiRequestPath = { refundCode: string }
export type CommonGetRefundInfoApiRequestQuery = never
export type CommonGetRefundInfoApiRequestBody = never
export type CommonGetRefundInfoApiRequest = CommonRequireRequestFields<
  CommonApiRequest<CommonGetRefundInfoApiRequestPath, CommonGetRefundInfoApiRequestQuery, CommonGetRefundInfoApiRequestBody>,
  'path'
>
export type CommonGetRefundInfoApiResponse = CommonRefundHistoryApiModel
