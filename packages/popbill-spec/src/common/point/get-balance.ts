import type { CommonApiRequest, CommonRequireRequestFields, CommonPointApiResponse } from '../common'

/** @see https://developers.popbill.com/api-reference/taxinvoice/common-api/point */
export type CommonGetBalanceApiRequestPath = { serviceID: string }
export type CommonGetBalanceApiRequestQuery = never
export type CommonGetBalanceApiRequestBody = never
export type CommonGetBalanceApiRequest = CommonRequireRequestFields<
  CommonApiRequest<CommonGetBalanceApiRequestPath, CommonGetBalanceApiRequestQuery, CommonGetBalanceApiRequestBody>,
  'path'
>
export type CommonGetBalanceApiResponse = CommonPointApiResponse
