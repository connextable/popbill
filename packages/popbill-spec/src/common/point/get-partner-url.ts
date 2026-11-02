import type { CommonApiRequest, CommonRequireRequestFields, CommonUrlApiResponse } from '../common'

/** @see https://developers.popbill.com/api-reference/taxinvoice/common-api/point */
export type CommonGetPartnerUrlApiRequestPath = { serviceID: string }
export type CommonGetPartnerUrlApiRequestQuery = { TG: 'CHRG' }
export type CommonGetPartnerUrlApiRequestBody = never
export type CommonGetPartnerUrlApiRequest = CommonRequireRequestFields<
  CommonApiRequest<CommonGetPartnerUrlApiRequestPath, CommonGetPartnerUrlApiRequestQuery, CommonGetPartnerUrlApiRequestBody>,
  'path' | 'query'
>
export type CommonGetPartnerUrlApiResponse = CommonUrlApiResponse
