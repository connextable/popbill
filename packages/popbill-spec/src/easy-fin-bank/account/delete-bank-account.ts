import type { EasyFinBankApiRequest, EasyFinBankRequireRequestFields, EasyFinBankAccountApiRequestPath, EasyFinBankApiResponseBase } from '../common'

/** @see https://developers.popbill.com/api-reference/easyfinbank/api/manage#DeleteBankAccount */
export type EasyFinBankDeleteBankAccountApiRequestPath = never
export type EasyFinBankDeleteBankAccountApiRequestQuery = never
export type EasyFinBankDeleteBankAccountApiRequestBody = EasyFinBankAccountApiRequestPath
export type EasyFinBankDeleteBankAccountApiRequest = EasyFinBankRequireRequestFields<
  EasyFinBankApiRequest<
    EasyFinBankDeleteBankAccountApiRequestPath,
    EasyFinBankDeleteBankAccountApiRequestQuery,
    EasyFinBankDeleteBankAccountApiRequestBody
  >,
  'body'
>
export type EasyFinBankDeleteBankAccountApiResponse = EasyFinBankApiResponseBase
