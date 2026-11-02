import type { AccountCheckApiRequest, AccountCheckIdentityNumberType, AccountCheckRequireRequestFields } from '../common'
import type { AccountCheckDepositorInfoApiModel } from '../models'

/** POST /EasyFin/DepositorCheck, query only. @see https://developers.popbill.com/api-reference/accountcheck/api/checkDepositor */
export interface AccountCheckCheckDepositorInfoApiRequestQuery {
  c: string
  n: string
  t: AccountCheckIdentityNumberType
  p: string
}
export type AccountCheckCheckDepositorInfoApiRequest = AccountCheckRequireRequestFields<
  AccountCheckApiRequest<AccountCheckCheckDepositorInfoApiRequestQuery>,
  'query'
>
export type AccountCheckCheckDepositorInfoApiResponse = AccountCheckDepositorInfoApiModel
