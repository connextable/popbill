import type { EasyFinBankApiRequest, EasyFinBankRequireRequestFields, EasyFinBankApiResponseBase } from '../common'

/** @see https://developers.popbill.com/api-reference/easyfinbank/api/search#SaveMemo */
export type EasyFinBankSaveMemoApiRequestPath = never
export type EasyFinBankSaveMemoApiRequestQuery = { TID: string; Memo: string }
export type EasyFinBankSaveMemoApiRequestBody = never
export type EasyFinBankSaveMemoApiRequest = EasyFinBankRequireRequestFields<
  EasyFinBankApiRequest<EasyFinBankSaveMemoApiRequestPath, EasyFinBankSaveMemoApiRequestQuery, EasyFinBankSaveMemoApiRequestBody>,
  'query'
>
export type EasyFinBankSaveMemoApiResponse = EasyFinBankApiResponseBase
