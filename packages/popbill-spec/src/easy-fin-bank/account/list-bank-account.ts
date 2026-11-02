import type { EasyFinBankApiRequest } from '../common'
import type { EasyFinBankAccountApiModel } from '../models'

/** @see https://developers.popbill.com/api-reference/easyfinbank/api/manage#ListBankAccount */
export type EasyFinBankListBankAccountApiRequestPath = never
export type EasyFinBankListBankAccountApiRequestQuery = never
export type EasyFinBankListBankAccountApiRequestBody = never
export type EasyFinBankListBankAccountApiRequest = EasyFinBankApiRequest<
  EasyFinBankListBankAccountApiRequestPath,
  EasyFinBankListBankAccountApiRequestQuery,
  EasyFinBankListBankAccountApiRequestBody
>
export type EasyFinBankListBankAccountApiResponse = EasyFinBankAccountApiModel[]
