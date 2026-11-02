import type { CommonApiRequest } from '../common'
import type { CommonCorpInfoApiModel } from '../models'

/** @see https://developers.popbill.com/api-reference/taxinvoice/common-api/member */
export type CommonGetCorpInfoApiRequestPath = never
export type CommonGetCorpInfoApiRequestQuery = never
export type CommonGetCorpInfoApiRequestBody = never
export type CommonGetCorpInfoApiRequest = CommonApiRequest<
  CommonGetCorpInfoApiRequestPath,
  CommonGetCorpInfoApiRequestQuery,
  CommonGetCorpInfoApiRequestBody
>
export type CommonGetCorpInfoApiResponse = CommonCorpInfoApiModel
