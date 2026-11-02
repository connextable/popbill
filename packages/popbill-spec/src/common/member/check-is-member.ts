import type { CommonUnauthenticatedApiRequest, CommonRequireRequestFields, CommonOperationApiResponse } from '../common'

/** @see https://developers.popbill.com/api-reference/taxinvoice/common-api/member */
export type CommonCheckIsMemberApiRequestPath = never
export type CommonCheckIsMemberApiRequestQuery = { CorpNum: string; LID: string }
export type CommonCheckIsMemberApiRequestBody = never
export type CommonCheckIsMemberApiRequest = CommonRequireRequestFields<
  CommonUnauthenticatedApiRequest<CommonCheckIsMemberApiRequestPath, CommonCheckIsMemberApiRequestQuery, CommonCheckIsMemberApiRequestBody>,
  'query'
>
export type CommonCheckIsMemberApiResponse = CommonOperationApiResponse
