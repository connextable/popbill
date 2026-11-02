import type { EasyFinBankApiRequest, EasyFinBankRequireRequestFields, EasyFinBankJobApiRequestPath } from '../common'
import type { EasyFinBankSummaryApiModel } from '../models'

/** @see https://developers.popbill.com/api-reference/easyfinbank/api/search#Summary */
export type EasyFinBankSummaryApiRequestPath = EasyFinBankJobApiRequestPath
export type EasyFinBankSummaryApiRequestQuery = { TradeType?: string; SearchString?: string }
export type EasyFinBankSummaryApiRequestBody = never
export type EasyFinBankSummaryApiRequest = EasyFinBankRequireRequestFields<
  EasyFinBankApiRequest<EasyFinBankSummaryApiRequestPath, EasyFinBankSummaryApiRequestQuery, EasyFinBankSummaryApiRequestBody>,
  'path'
>
export type EasyFinBankSummaryApiResponse = EasyFinBankSummaryApiModel
