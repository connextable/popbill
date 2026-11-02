import type {
  StatementApiRequest,
  StatementApiResponseBase,
  StatementDateString,
  StatementDateType,
  StatementRequireRequestFields,
  StatementSearchStateCode,
  StatementSortOrder,
} from '../common'
import type { StatementInfoApiModel } from '../models'

/**
 * 전자명세서 목록조회 API(raw).
 * @see https://developers.popbill.com/api-reference/statement/api/info#Search
 */
export type StatementSearchApiRequestPath = never
export interface StatementSearchApiRequestQuery {
  DType: StatementDateType
  SDate: StatementDateString
  EDate: StatementDateString
  /** 쉼표로 연결한 상태코드. 예: 100,300 또는 1**,3**. */
  State?: StatementSearchStateCode
  /** 쉼표로 연결한 문서 종류 코드. 예: 121,122. */
  ItemCode?: string
  QString?: string
  Order?: StatementSortOrder
  Page?: number
  /** 최대 1,000. 기본 500. */
  PerPage?: number
}
export type StatementSearchApiRequestBody = never
export type StatementSearchApiRequest = StatementRequireRequestFields<
  StatementApiRequest<StatementSearchApiRequestPath, StatementSearchApiRequestQuery, StatementSearchApiRequestBody>,
  'query'
>
export interface StatementSearchApiResponse extends StatementApiResponseBase {
  pageNum?: number
  perPage?: number
  pageCount?: number
  total?: number
  list?: StatementInfoApiModel[]
}
