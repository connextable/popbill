import type { CommonApiRequest, CommonRequireRequestFields, CommonUrlApiResponse } from '../common'

/** @see https://developers.popbill.com/api-reference/taxinvoice/common-api/member */
export type CommonGetAccessUrlApiRequestPath = never
export type CommonGetAccessUrlApiRequestQuery = { TG: 'LOGIN' }
export type CommonGetAccessUrlApiRequestBody = never
export type CommonGetAccessUrlApiRequest = CommonRequireRequestFields<
  CommonApiRequest<CommonGetAccessUrlApiRequestPath, CommonGetAccessUrlApiRequestQuery, CommonGetAccessUrlApiRequestBody>,
  'query'
>
export type CommonGetAccessUrlApiResponse = CommonUrlApiResponse
