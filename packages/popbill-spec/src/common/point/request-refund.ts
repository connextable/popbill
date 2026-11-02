import type { CommonApiRequest, CommonRequireRequestFields, CommonOperationApiResponse } from '../common'
import type { CommonRefundFormApiModel } from '../models'

/** @see https://developers.popbill.com/api-reference/taxinvoice/common-api/point */
export type CommonRequestRefundApiRequestPath = never
export type CommonRequestRefundApiRequestQuery = never
export type CommonRequestRefundApiRequestBody = CommonRefundFormApiModel
export type CommonRequestRefundApiRequest = CommonRequireRequestFields<
  CommonApiRequest<CommonRequestRefundApiRequestPath, CommonRequestRefundApiRequestQuery, CommonRequestRefundApiRequestBody>,
  'body'
>
export type CommonRequestRefundApiResponse = CommonOperationApiResponse & { refundCode: string }
