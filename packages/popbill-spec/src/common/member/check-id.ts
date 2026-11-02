import type { CommonUnauthenticatedApiRequest, CommonRequireRequestFields, CommonOperationApiResponse } from '../common'

/** @see https://developers.popbill.com/api-reference/taxinvoice/common-api/member */
export type CommonCheckIdApiRequestPath = never
export type CommonCheckIdApiRequestQuery = { ID: string }
export type CommonCheckIdApiRequestBody = never
export type CommonCheckIdApiRequest = CommonRequireRequestFields<
  CommonUnauthenticatedApiRequest<CommonCheckIdApiRequestPath, CommonCheckIdApiRequestQuery, CommonCheckIdApiRequestBody>,
  'query'
>
export type CommonCheckIdApiResponse = CommonOperationApiResponse
