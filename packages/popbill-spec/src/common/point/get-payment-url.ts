import type { CommonApiRequest, CommonRequireRequestFields, CommonUrlApiResponse } from '../common'

/** @see https://developers.popbill.com/api-reference/taxinvoice/common-api/point */
export type CommonGetPaymentUrlApiRequestPath = never
export type CommonGetPaymentUrlApiRequestQuery = { TG: 'PAYMENT' }
export type CommonGetPaymentUrlApiRequestBody = never
export type CommonGetPaymentUrlApiRequest = CommonRequireRequestFields<
  CommonApiRequest<CommonGetPaymentUrlApiRequestPath, CommonGetPaymentUrlApiRequestQuery, CommonGetPaymentUrlApiRequestBody>,
  'query'
>
export type CommonGetPaymentUrlApiResponse = CommonUrlApiResponse
