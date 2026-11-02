import type { EasyFinBankApiRequest, EasyFinBankRequireRequestFields, EasyFinBankAccountApiRequestPath, EasyFinBankApiResponseBase } from '../common'

/** @see https://developers.popbill.com/api-reference/easyfinbank/api/manage#RevokeCloseBankAccount */
export type EasyFinBankRevokeCloseBankAccountApiRequestPath = never
export type EasyFinBankRevokeCloseBankAccountApiRequestQuery = EasyFinBankAccountApiRequestPath
export type EasyFinBankRevokeCloseBankAccountApiRequestBody = never
export type EasyFinBankRevokeCloseBankAccountApiRequest = EasyFinBankRequireRequestFields<
  EasyFinBankApiRequest<
    EasyFinBankRevokeCloseBankAccountApiRequestPath,
    EasyFinBankRevokeCloseBankAccountApiRequestQuery,
    EasyFinBankRevokeCloseBankAccountApiRequestBody
  >,
  'query'
>
export type EasyFinBankRevokeCloseBankAccountApiResponse = EasyFinBankApiResponseBase
