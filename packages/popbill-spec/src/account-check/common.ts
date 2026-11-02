import type { PopbillApiRequest, PopbillRequireRequestFields } from '../request'

export type AccountCheckApiRequest<TQuery = never> = PopbillApiRequest<never, TQuery>
export type AccountCheckRequireRequestFields<T, K extends keyof T> = PopbillRequireRequestFields<T, K>
export type AccountCheckServiceType = '성명' | '실명'
export type AccountCheckIdentityNumberType = 'P' | 'B'

export interface AccountCheckChargeInfoApiResponse {
  unitCost: string
  chargeMethod: string
  rateSystem: string
}
