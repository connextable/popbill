import type { EasyFinBankApiRequest, EasyFinBankRequireRequestFields, EasyFinBankAccountApiRequestPath } from '../common'

/** @see https://developers.popbill.com/api-reference/easyfinbank/api/job#RequestJob */
export type EasyFinBankRequestJobApiRequestPath = never
export type EasyFinBankRequestJobApiRequestQuery = EasyFinBankAccountApiRequestPath & { SDate: string; EDate: string }
export type EasyFinBankRequestJobApiRequestBody = never
export type EasyFinBankRequestJobApiRequest = EasyFinBankRequireRequestFields<
  EasyFinBankApiRequest<EasyFinBankRequestJobApiRequestPath, EasyFinBankRequestJobApiRequestQuery, EasyFinBankRequestJobApiRequestBody>,
  'query'
>
export type EasyFinBankRequestJobApiResponse = { jobID: string }
