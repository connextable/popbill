import type { EasyFinBankApiRequest, EasyFinBankRequireRequestFields, EasyFinBankUrlApiResponse } from '../common'

/** @see https://developers.popbill.com/api-reference/easyfinbank/api/manage#GetBankAccountMgtURL */
export type EasyFinBankGetBankAccountMgtURLApiRequestPath = never
export type EasyFinBankGetBankAccountMgtURLApiRequestQuery = { TG: 'BankAccount' }
export type EasyFinBankGetBankAccountMgtURLApiRequestBody = never
export type EasyFinBankGetBankAccountMgtURLApiRequest = EasyFinBankRequireRequestFields<
  EasyFinBankApiRequest<
    EasyFinBankGetBankAccountMgtURLApiRequestPath,
    EasyFinBankGetBankAccountMgtURLApiRequestQuery,
    EasyFinBankGetBankAccountMgtURLApiRequestBody
  >,
  'query'
>
export type EasyFinBankGetBankAccountMgtURLApiResponse = EasyFinBankUrlApiResponse
