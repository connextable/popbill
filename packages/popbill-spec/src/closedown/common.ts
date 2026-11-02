import type { PopbillApiRequest, PopbillRequireRequestFields } from '../request'

export type ClosedownApiRequest<TQuery = never, TBody = never> = PopbillApiRequest<never, TQuery, TBody>
export type ClosedownRequireRequestFields<T, K extends keyof T> = PopbillRequireRequestFields<T, K>

export interface ClosedownChargeInfoApiResponse {
  unitCost: string
  chargeMethod: string
  rateSystem: string
}
