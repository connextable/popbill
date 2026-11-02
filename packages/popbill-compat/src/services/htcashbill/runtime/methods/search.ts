import { filterQuery, jobPath, request } from '../common'
import type { HTCashbillRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'

export function requestSearch(
  context: HTCashbillRuntimeContext,
  corpNum: string,
  jobId: string,
  tradeType: Spec.HomeTaxCashbillTradeType[] | undefined,
  tradeUsage: Spec.HomeTaxCashbillTradeUsage[] | undefined,
  page: number | undefined,
  perPage: number | undefined,
  order: Spec.HomeTaxCashbillSortOrder | undefined,
  userId?: string
): Promise<Spec.HomeTaxCashbillSearchApiResponse> {
  const path = jobPath(jobId)
  const query = filterQuery(tradeType, tradeUsage)
  if (page) query.set('Page', String(page))
  if (perPage) query.set('PerPage', String(perPage))
  if (order) query.set('Order', order)
  return request(context, corpNum, `${path}?${query.toString()}`, userId)
}
