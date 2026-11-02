import type { EasyFinBankApiRequest, EasyFinBankRequireRequestFields, EasyFinBankJobApiRequestPath } from '../common'
import type { EasyFinBankSearchResultApiModel } from '../models'

/** @see https://developers.popbill.com/api-reference/easyfinbank/api/search#Search */
export type EasyFinBankSearchApiRequestPath = EasyFinBankJobApiRequestPath
export type EasyFinBankSearchApiRequestQuery = {
  TradeType?: string
  SearchString?: string
  Order?: 'A' | 'D' | (string & {})
  Page?: number
  PerPage?: number
}
export type EasyFinBankSearchApiRequestBody = never
export type EasyFinBankSearchApiRequest = EasyFinBankRequireRequestFields<
  EasyFinBankApiRequest<EasyFinBankSearchApiRequestPath, EasyFinBankSearchApiRequestQuery, EasyFinBankSearchApiRequestBody>,
  'path'
>
export type EasyFinBankSearchApiResponse = EasyFinBankSearchResultApiModel
