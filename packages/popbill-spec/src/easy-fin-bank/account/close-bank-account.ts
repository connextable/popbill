import type { EasyFinBankApiRequest, EasyFinBankRequireRequestFields, EasyFinBankAccountApiRequestPath, EasyFinBankApiResponseBase } from '../common'

/** @see https://developers.popbill.com/api-reference/easyfinbank/api/manage#CloseBankAccount */
export type EasyFinBankCloseBankAccountApiRequestPath = never
export type EasyFinBankCloseBankAccountApiRequestQuery = EasyFinBankAccountApiRequestPath & { CloseType: '일반' | (string & {}) }
export type EasyFinBankCloseBankAccountApiRequestBody = never
export type EasyFinBankCloseBankAccountApiRequest = EasyFinBankRequireRequestFields<
  EasyFinBankApiRequest<
    EasyFinBankCloseBankAccountApiRequestPath,
    EasyFinBankCloseBankAccountApiRequestQuery,
    EasyFinBankCloseBankAccountApiRequestBody
  >,
  'query'
>
export type EasyFinBankCloseBankAccountApiResponse = EasyFinBankApiResponseBase
