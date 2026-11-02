import type { EasyFinBankApiRequest, EasyFinBankRequireRequestFields, EasyFinBankAccountApiRequestPath } from '../common'
import type { EasyFinBankAccountApiModel } from '../models'

/** @see https://developers.popbill.com/api-reference/easyfinbank/api/manage#GetBankAccountInfo */
export type EasyFinBankGetBankAccountInfoApiRequestPath = EasyFinBankAccountApiRequestPath
export type EasyFinBankGetBankAccountInfoApiRequestQuery = never
export type EasyFinBankGetBankAccountInfoApiRequestBody = never
export type EasyFinBankGetBankAccountInfoApiRequest = EasyFinBankRequireRequestFields<
  EasyFinBankApiRequest<
    EasyFinBankGetBankAccountInfoApiRequestPath,
    EasyFinBankGetBankAccountInfoApiRequestQuery,
    EasyFinBankGetBankAccountInfoApiRequestBody
  >,
  'path'
>
export type EasyFinBankGetBankAccountInfoApiResponse = EasyFinBankAccountApiModel
