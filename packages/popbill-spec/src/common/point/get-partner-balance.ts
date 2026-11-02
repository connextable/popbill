import type { CommonApiRequest, CommonRequireRequestFields, CommonPointApiResponse } from '../common'

/** @see https://developers.popbill.com/api-reference/taxinvoice/common-api/point */
export type CommonGetPartnerBalanceApiRequestPath = { serviceID: string }
export type CommonGetPartnerBalanceApiRequestQuery = never
export type CommonGetPartnerBalanceApiRequestBody = never
export type CommonGetPartnerBalanceApiRequest = CommonRequireRequestFields<
  CommonApiRequest<CommonGetPartnerBalanceApiRequestPath, CommonGetPartnerBalanceApiRequestQuery, CommonGetPartnerBalanceApiRequestBody>,
  'path'
>
export type CommonGetPartnerBalanceApiResponse = CommonPointApiResponse
