import type { CommonApiRequest, CommonRequireRequestFields, CommonOperationApiResponse } from '../common'

/** @see https://developers.popbill.com/api-reference/taxinvoice/common-api/member */
export type CommonQuitMemberApiRequestPath = never
export type CommonQuitMemberApiRequestQuery = never
export type CommonQuitMemberApiRequestBody = { quitReason: string }
export type CommonQuitMemberApiRequest = CommonRequireRequestFields<
  CommonApiRequest<CommonQuitMemberApiRequestPath, CommonQuitMemberApiRequestQuery, CommonQuitMemberApiRequestBody>,
  'body'
>
export type CommonQuitMemberApiResponse = CommonOperationApiResponse
