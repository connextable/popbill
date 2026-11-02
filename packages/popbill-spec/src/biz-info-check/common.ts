import type { PopbillApiRequest, PopbillRequireRequestFields } from '../request'

export type BizInfoCheckApiRequest<TQuery = never> = PopbillApiRequest<never, TQuery>
export type BizInfoCheckRequireRequestFields<T, K extends keyof T> = PopbillRequireRequestFields<T, K>

export interface BizInfoCheckChargeInfoApiResponse {
  unitCost: string
  chargeMethod: string
  rateSystem: string
}
