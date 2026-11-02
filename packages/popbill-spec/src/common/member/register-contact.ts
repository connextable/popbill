import type { CommonApiRequest, CommonRequireRequestFields, CommonOperationApiResponse } from '../common'
import type { CommonRegisterContactApiModel } from '../models'

/** @see https://developers.popbill.com/api-reference/taxinvoice/common-api/member */
export type CommonRegisterContactApiRequestPath = never
export type CommonRegisterContactApiRequestQuery = never
export type CommonRegisterContactApiRequestBody = CommonRegisterContactApiModel
export type CommonRegisterContactApiRequest = CommonRequireRequestFields<
  CommonApiRequest<CommonRegisterContactApiRequestPath, CommonRegisterContactApiRequestQuery, CommonRegisterContactApiRequestBody>,
  'body'
>
export type CommonRegisterContactApiResponse = CommonOperationApiResponse
