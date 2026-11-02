import type { CommonApiRequest, CommonRequireRequestFields, CommonOperationApiResponse } from '../common'

/** @see https://developers.popbill.com/api-reference/taxinvoice/common-api/member */
export type CommonDeleteContactApiRequestPath = never
export type CommonDeleteContactApiRequestQuery = { ContactID: string }
export type CommonDeleteContactApiRequestBody = never
export type CommonDeleteContactApiRequest = CommonRequireRequestFields<
  CommonApiRequest<CommonDeleteContactApiRequestPath, CommonDeleteContactApiRequestQuery, CommonDeleteContactApiRequestBody>,
  'query'
>
export type CommonDeleteContactApiResponse = CommonOperationApiResponse
