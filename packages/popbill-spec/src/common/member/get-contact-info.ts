import type { CommonApiRequest, CommonRequireRequestFields } from '../common'
import type { CommonContactApiModel } from '../models'

/** @see https://developers.popbill.com/api-reference/taxinvoice/common-api/member */
export type CommonGetContactInfoApiRequestPath = never
export type CommonGetContactInfoApiRequestQuery = never
export type CommonGetContactInfoApiRequestBody = { id: string }
export type CommonGetContactInfoApiRequest = CommonRequireRequestFields<
  CommonApiRequest<CommonGetContactInfoApiRequestPath, CommonGetContactInfoApiRequestQuery, CommonGetContactInfoApiRequestBody>,
  'body'
>
export type CommonGetContactInfoApiResponse = CommonContactApiModel
