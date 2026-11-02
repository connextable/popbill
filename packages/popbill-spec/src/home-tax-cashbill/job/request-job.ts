import type { HomeTaxCashbillApiRequest, HomeTaxCashbillType } from '../common'
import type { PopbillRequireRequestFields } from '../../request'

/** POST /HomeTax/Cashbill/{QueryType}. 기간은 최대 3개월, 반환 JobID는 요청 시점부터 1시간 유효합니다. */
export interface HomeTaxCashbillRequestJobApiRequestPath {
  QueryType: HomeTaxCashbillType
}
export interface HomeTaxCashbillRequestJobApiRequestQuery {
  SDate: string
  EDate: string
}
export type HomeTaxCashbillRequestJobApiRequestBody = never
export type HomeTaxCashbillRequestJobApiRequest = PopbillRequireRequestFields<
  HomeTaxCashbillApiRequest<HomeTaxCashbillRequestJobApiRequestPath, HomeTaxCashbillRequestJobApiRequestQuery>,
  'path' | 'query'
>
export interface HomeTaxCashbillRequestJobApiResponse {
  jobID: string
}
