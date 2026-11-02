import type { AccountCheckApiRequest, AccountCheckRequireRequestFields } from '../common'
import type { AccountCheckAccountInfoApiModel } from '../models'

/** POST /EasyFin/AccountCheck, query only. @see https://developers.popbill.com/api-reference/accountcheck/api/checkAccount */
export interface AccountCheckCheckAccountInfoApiRequestQuery {
  c: string
  n: string
}
export type AccountCheckCheckAccountInfoApiRequest = AccountCheckRequireRequestFields<
  AccountCheckApiRequest<AccountCheckCheckAccountInfoApiRequestQuery>,
  'query'
>
export type AccountCheckCheckAccountInfoApiResponse = AccountCheckAccountInfoApiModel
