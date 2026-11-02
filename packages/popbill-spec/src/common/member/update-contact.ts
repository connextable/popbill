import type { CommonApiRequest, CommonRequireRequestFields, CommonOperationApiResponse } from '../common'
import type { CommonContactInputApiModel } from '../models'

/** @see https://developers.popbill.com/api-reference/taxinvoice/common-api/member */
export type CommonUpdateContactApiRequestPath = never
export type CommonUpdateContactApiRequestQuery = never
export type CommonUpdateContactApiRequestBody = CommonContactInputApiModel
export type CommonUpdateContactApiRequest = CommonRequireRequestFields<
  CommonApiRequest<CommonUpdateContactApiRequestPath, CommonUpdateContactApiRequestQuery, CommonUpdateContactApiRequestBody>,
  'body'
>
export type CommonUpdateContactApiResponse = CommonOperationApiResponse
