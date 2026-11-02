import type { CommonApiRequest, CommonRequireRequestFields, CommonUrlApiResponse } from '../common'

/** @see https://developers.popbill.com/api-reference/taxinvoice/common-api/point */
export type CommonGetUseHistoryUrlApiRequestPath = never
export type CommonGetUseHistoryUrlApiRequestQuery = { TG: 'USEHISTORY' }
export type CommonGetUseHistoryUrlApiRequestBody = never
export type CommonGetUseHistoryUrlApiRequest = CommonRequireRequestFields<
  CommonApiRequest<CommonGetUseHistoryUrlApiRequestPath, CommonGetUseHistoryUrlApiRequestQuery, CommonGetUseHistoryUrlApiRequestBody>,
  'query'
>
export type CommonGetUseHistoryUrlApiResponse = CommonUrlApiResponse
