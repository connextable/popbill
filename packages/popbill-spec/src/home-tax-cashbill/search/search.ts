import type {
  HomeTaxCashbillApiRequest,
  HomeTaxCashbillFilterApiRequestQuery,
  HomeTaxCashbillJobApiRequestPath,
  HomeTaxCashbillSortOrder,
} from '../common'
import type { HomeTaxCashbillApiModel } from '../models'
import type { PopbillRequireRequestFields } from '../../request'
/** GET /HomeTax/Cashbill/{jobID}. 완료 및 성공한 작업에서만 조회할 수 있습니다. */
export type HomeTaxCashbillSearchApiRequestPath = HomeTaxCashbillJobApiRequestPath
export interface HomeTaxCashbillSearchApiRequestQuery extends HomeTaxCashbillFilterApiRequestQuery {
  Order?: HomeTaxCashbillSortOrder
  Page?: number
  /** 기본값 500. 현재 문서의 상한은 1,000이며 서버에서 검증합니다. */
  PerPage?: number
}
export type HomeTaxCashbillSearchApiRequestBody = never
export type HomeTaxCashbillSearchApiRequest = PopbillRequireRequestFields<
  HomeTaxCashbillApiRequest<HomeTaxCashbillSearchApiRequestPath, HomeTaxCashbillSearchApiRequestQuery>,
  'path'
>
export interface HomeTaxCashbillSearchApiResponse {
  code: number
  message?: string
  pageNum?: number
  perPage?: number
  pageCount?: number
  total?: number
  list?: HomeTaxCashbillApiModel[]
}
