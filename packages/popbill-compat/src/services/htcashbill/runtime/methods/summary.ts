import { filterQuery, jobPath, request } from '../common'
import type { HTCashbillRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'

export function requestSummary(
  context: HTCashbillRuntimeContext,
  corpNum: string,
  jobId: string,
  tradeType: Spec.HomeTaxCashbillTradeType[] | undefined,
  tradeUsage: Spec.HomeTaxCashbillTradeUsage[] | undefined,
  userId?: string
): Promise<Spec.HomeTaxCashbillSummaryApiResponse> {
  return request(context, corpNum, `${jobPath(jobId)}/Summary?${filterQuery(tradeType, tradeUsage).toString()}`, userId)
}
