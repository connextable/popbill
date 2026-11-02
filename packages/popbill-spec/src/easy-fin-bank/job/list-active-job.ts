import type { EasyFinBankApiRequest } from '../common'
import type { EasyFinBankJobStateApiModel } from '../models'

/** @see https://developers.popbill.com/api-reference/easyfinbank/api/job#ListActiveJob */
export type EasyFinBankListActiveJobApiRequestPath = never
export type EasyFinBankListActiveJobApiRequestQuery = never
export type EasyFinBankListActiveJobApiRequestBody = never
export type EasyFinBankListActiveJobApiRequest = EasyFinBankApiRequest<
  EasyFinBankListActiveJobApiRequestPath,
  EasyFinBankListActiveJobApiRequestQuery,
  EasyFinBankListActiveJobApiRequestBody
>
export type EasyFinBankListActiveJobApiResponse = EasyFinBankJobStateApiModel[]
