import type { CommonApiRequest } from '../common'
import type { CommonContactApiModel } from '../models'

/** @see https://developers.popbill.com/api-reference/taxinvoice/common-api/member */
export type CommonListContactsApiRequestPath = never
export type CommonListContactsApiRequestQuery = never
export type CommonListContactsApiRequestBody = never
export type CommonListContactsApiRequest = CommonApiRequest<
  CommonListContactsApiRequestPath,
  CommonListContactsApiRequestQuery,
  CommonListContactsApiRequestBody
>
export type CommonListContactsApiResponse = CommonContactApiModel[]
