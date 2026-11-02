import type { CommonApiRequest, CommonRequireRequestFields, CommonPageApiResponse } from '../common'
import type { CommonUseHistoryApiModel } from '../models'

/** @see https://developers.popbill.com/api-reference/taxinvoice/common-api/point */
export type CommonGetUseHistoryApiRequestPath = never
export interface CommonGetUseHistoryApiRequestQuery {
  SDate: string
  EDate: string
  Order?: 'A' | 'D'
  Page?: number
  PerPage?: number
}
export type CommonGetUseHistoryApiRequestBody = never
export type CommonGetUseHistoryApiRequest = CommonRequireRequestFields<
  CommonApiRequest<CommonGetUseHistoryApiRequestPath, CommonGetUseHistoryApiRequestQuery, CommonGetUseHistoryApiRequestBody>,
  'query'
>
export type CommonGetUseHistoryApiResponse = CommonPageApiResponse<CommonUseHistoryApiModel>
