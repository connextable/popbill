import type { EasyFinBankApiRequest } from '../common'
import type { EasyFinBankChargeInfoApiModel } from '../models'

/** @see https://developers.popbill.com/api-reference/easyfinbank/common-api/point#GetChargeInfo */
export type EasyFinBankGetChargeInfoApiRequestPath = never
export type EasyFinBankGetChargeInfoApiRequestQuery = never
export type EasyFinBankGetChargeInfoApiRequestBody = never
export type EasyFinBankGetChargeInfoApiRequest = EasyFinBankApiRequest<
  EasyFinBankGetChargeInfoApiRequestPath,
  EasyFinBankGetChargeInfoApiRequestQuery,
  EasyFinBankGetChargeInfoApiRequestBody
>
export type EasyFinBankGetChargeInfoApiResponse = EasyFinBankChargeInfoApiModel
