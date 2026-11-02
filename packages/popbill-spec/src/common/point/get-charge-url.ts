import type { CommonApiRequest, CommonRequireRequestFields, CommonUrlApiResponse } from '../common'

/** @see https://developers.popbill.com/api-reference/taxinvoice/common-api/point */
export type CommonGetChargeUrlApiRequestPath = never
export type CommonGetChargeUrlApiRequestQuery = { TG: 'CHRG' }
export type CommonGetChargeUrlApiRequestBody = never
export type CommonGetChargeUrlApiRequest = CommonRequireRequestFields<
  CommonApiRequest<CommonGetChargeUrlApiRequestPath, CommonGetChargeUrlApiRequestQuery, CommonGetChargeUrlApiRequestBody>,
  'query'
>
export type CommonGetChargeUrlApiResponse = CommonUrlApiResponse
