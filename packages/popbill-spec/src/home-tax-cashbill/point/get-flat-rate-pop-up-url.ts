import type { HomeTaxCashbillApiRequest, HomeTaxCashbillUrlApiResponse } from '../common'
import type { PopbillRequireRequestFields } from '../../request'
/** GET /HomeTax/Cashbill?TG=CHRG. */
export type HomeTaxCashbillGetFlatRatePopUpURLApiRequestPath = never
export interface HomeTaxCashbillGetFlatRatePopUpURLApiRequestQuery {
  TG: 'CHRG'
}
export type HomeTaxCashbillGetFlatRatePopUpURLApiRequestBody = never
export type HomeTaxCashbillGetFlatRatePopUpURLApiRequest = PopbillRequireRequestFields<
  HomeTaxCashbillApiRequest<never, HomeTaxCashbillGetFlatRatePopUpURLApiRequestQuery, never>,
  'query'
>
export type HomeTaxCashbillGetFlatRatePopUpURLApiResponse = HomeTaxCashbillUrlApiResponse
