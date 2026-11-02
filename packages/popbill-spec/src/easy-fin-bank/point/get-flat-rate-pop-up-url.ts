import type { EasyFinBankApiRequest, EasyFinBankRequireRequestFields, EasyFinBankUrlApiResponse } from '../common'

/** @see https://developers.popbill.com/api-reference/easyfinbank/common-api/point#GetFlatRatePopUpURL */
export type EasyFinBankGetFlatRatePopUpURLApiRequestPath = never
export type EasyFinBankGetFlatRatePopUpURLApiRequestQuery = { TG: 'CHRG' }
export type EasyFinBankGetFlatRatePopUpURLApiRequestBody = never
export type EasyFinBankGetFlatRatePopUpURLApiRequest = EasyFinBankRequireRequestFields<
  EasyFinBankApiRequest<
    EasyFinBankGetFlatRatePopUpURLApiRequestPath,
    EasyFinBankGetFlatRatePopUpURLApiRequestQuery,
    EasyFinBankGetFlatRatePopUpURLApiRequestBody
  >,
  'query'
>
export type EasyFinBankGetFlatRatePopUpURLApiResponse = EasyFinBankUrlApiResponse
