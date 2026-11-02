import type { CommonApiRequest, CommonRequireRequestFields, CommonOperationApiResponse } from '../common'
import type { CommonPaymentFormApiModel } from '../models'

/** @see https://developers.popbill.com/api-reference/taxinvoice/common-api/point */
export type CommonRequestPaymentApiRequestPath = never
export type CommonRequestPaymentApiRequestQuery = never
export type CommonRequestPaymentApiRequestBody = CommonPaymentFormApiModel
export type CommonRequestPaymentApiRequest = CommonRequireRequestFields<
  CommonApiRequest<CommonRequestPaymentApiRequestPath, CommonRequestPaymentApiRequestQuery, CommonRequestPaymentApiRequestBody>,
  'body'
>
export type CommonRequestPaymentApiResponse = CommonOperationApiResponse & { settleCode: string }
