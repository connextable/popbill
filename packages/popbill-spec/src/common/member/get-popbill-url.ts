import type { CommonApiRequest, CommonRequireRequestFields, CommonUrlApiResponse } from '../common'

/** @see https://developers.popbill.com/api-reference/taxinvoice/common-api/member */
export type CommonGetPopbillUrlApiRequestPath = never
export type CommonGetPopbillUrlApiRequestQuery = { TG: string }
export type CommonGetPopbillUrlApiRequestBody = never
export type CommonGetPopbillUrlApiRequest = CommonRequireRequestFields<
  CommonApiRequest<CommonGetPopbillUrlApiRequestPath, CommonGetPopbillUrlApiRequestQuery, CommonGetPopbillUrlApiRequestBody>,
  'query'
>
export type CommonGetPopbillUrlApiResponse = CommonUrlApiResponse
