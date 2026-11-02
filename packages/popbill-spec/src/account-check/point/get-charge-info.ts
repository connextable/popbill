import type { AccountCheckApiRequest, AccountCheckChargeInfoApiResponse, AccountCheckServiceType } from '../common'

/** GET /EasyFin/AccountCheck/ChargeInfo. @see https://developers.popbill.com/api-reference/accountcheck/common-api/point#GetChargeInfo */
export interface AccountCheckGetChargeInfoApiRequestQuery {
  serviceType?: AccountCheckServiceType
}
export type AccountCheckGetChargeInfoApiRequest = AccountCheckApiRequest<AccountCheckGetChargeInfoApiRequestQuery>
export type AccountCheckGetChargeInfoApiResponse = AccountCheckChargeInfoApiResponse
