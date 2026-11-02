import type { EasyFinBankApiRequest, EasyFinBankRequireRequestFields, EasyFinBankJobApiRequestPath } from '../common'
import type { EasyFinBankJobStateApiModel } from '../models'

/** @see https://developers.popbill.com/api-reference/easyfinbank/api/job#GetJobState */
export type EasyFinBankGetJobStateApiRequestPath = EasyFinBankJobApiRequestPath
export type EasyFinBankGetJobStateApiRequestQuery = never
export type EasyFinBankGetJobStateApiRequestBody = never
export type EasyFinBankGetJobStateApiRequest = EasyFinBankRequireRequestFields<
  EasyFinBankApiRequest<EasyFinBankGetJobStateApiRequestPath, EasyFinBankGetJobStateApiRequestQuery, EasyFinBankGetJobStateApiRequestBody>,
  'path'
>
export type EasyFinBankGetJobStateApiResponse = EasyFinBankJobStateApiModel
