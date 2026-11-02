import type { CommonApiRequest, CommonRequireRequestFields, CommonOperationApiResponse } from '../common'
import type { CommonCorpInfoApiModel } from '../models'

/** @see https://developers.popbill.com/api-reference/taxinvoice/common-api/member */
export type CommonUpdateCorpInfoApiRequestPath = never
export type CommonUpdateCorpInfoApiRequestQuery = never
export type CommonUpdateCorpInfoApiRequestBody = CommonCorpInfoApiModel
export type CommonUpdateCorpInfoApiRequest = CommonRequireRequestFields<
  CommonApiRequest<CommonUpdateCorpInfoApiRequestPath, CommonUpdateCorpInfoApiRequestQuery, CommonUpdateCorpInfoApiRequestBody>,
  'body'
>
export type CommonUpdateCorpInfoApiResponse = CommonOperationApiResponse
