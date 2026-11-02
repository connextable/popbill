import type { EasyFinBankApiRequest, EasyFinBankRequireRequestFields, EasyFinBankApiResponseBase } from '../common'
import type { EasyFinBankAccountFormApiModel } from '../models'

/** @see https://developers.popbill.com/api-reference/easyfinbank/api/manage#RegistBankAccount */
export type EasyFinBankRegistBankAccountApiRequestPath = never
export type EasyFinBankRegistBankAccountApiRequestQuery = { UsePeriod?: number }
export type EasyFinBankRegistBankAccountApiRequestBody = EasyFinBankAccountFormApiModel
export type EasyFinBankRegistBankAccountApiRequest = EasyFinBankRequireRequestFields<
  EasyFinBankApiRequest<
    EasyFinBankRegistBankAccountApiRequestPath,
    EasyFinBankRegistBankAccountApiRequestQuery,
    EasyFinBankRegistBankAccountApiRequestBody
  >,
  'body'
>
export type EasyFinBankRegistBankAccountApiResponse = EasyFinBankApiResponseBase
