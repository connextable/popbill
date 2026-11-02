import type { CommonUnauthenticatedApiRequest, CommonRequireRequestFields, CommonOperationApiResponse } from '../common'
import type { CommonJoinFormApiModel } from '../models'

/** @see https://developers.popbill.com/api-reference/taxinvoice/common-api/member */
export type CommonJoinMemberApiRequestPath = never
export type CommonJoinMemberApiRequestQuery = never
export type CommonJoinMemberApiRequestBody = CommonJoinFormApiModel
export type CommonJoinMemberApiRequest = CommonRequireRequestFields<
  CommonUnauthenticatedApiRequest<CommonJoinMemberApiRequestPath, CommonJoinMemberApiRequestQuery, CommonJoinMemberApiRequestBody>,
  'body'
>
export type CommonJoinMemberApiResponse = CommonOperationApiResponse
