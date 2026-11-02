import type { EasyFinBankApiRequest, EasyFinBankRequireRequestFields, EasyFinBankAccountApiRequestPath, EasyFinBankApiResponseBase } from '../common'
import type { EasyFinBankUpdateAccountFormApiModel } from '../models'

/** @see https://developers.popbill.com/api-reference/easyfinbank/api/manage#UpdateBankAccount */
export type EasyFinBankUpdateBankAccountApiRequestPath = EasyFinBankAccountApiRequestPath
export type EasyFinBankUpdateBankAccountApiRequestQuery = never
export type EasyFinBankUpdateBankAccountApiRequestBody = EasyFinBankUpdateAccountFormApiModel
export type EasyFinBankUpdateBankAccountApiRequest = EasyFinBankRequireRequestFields<
  EasyFinBankApiRequest<
    EasyFinBankUpdateBankAccountApiRequestPath,
    EasyFinBankUpdateBankAccountApiRequestQuery,
    EasyFinBankUpdateBankAccountApiRequestBody
  >,
  'path' | 'body'
>
export type EasyFinBankUpdateBankAccountApiResponse = EasyFinBankApiResponseBase
