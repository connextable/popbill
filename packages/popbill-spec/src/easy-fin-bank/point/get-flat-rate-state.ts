import type { EasyFinBankApiRequest, EasyFinBankRequireRequestFields, EasyFinBankAccountApiRequestPath } from '../common'
import type { EasyFinBankFlatRateApiModel } from '../models'

/** @see https://developers.popbill.com/api-reference/easyfinbank/common-api/point#GetFlatRateState */
export type EasyFinBankGetFlatRateStateApiRequestPath = EasyFinBankAccountApiRequestPath
export type EasyFinBankGetFlatRateStateApiRequestQuery = never
export type EasyFinBankGetFlatRateStateApiRequestBody = never
export type EasyFinBankGetFlatRateStateApiRequest = EasyFinBankRequireRequestFields<
  EasyFinBankApiRequest<
    EasyFinBankGetFlatRateStateApiRequestPath,
    EasyFinBankGetFlatRateStateApiRequestQuery,
    EasyFinBankGetFlatRateStateApiRequestBody
  >,
  'path'
>
export type EasyFinBankGetFlatRateStateApiResponse = EasyFinBankFlatRateApiModel
