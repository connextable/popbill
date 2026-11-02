import type { EasyFinBankSummaryApiModel, EasyFinBankTradeType } from '@connextable/popbill-spec'
import { filterQuery, jobPath, request } from '../common'
import type { EasyFinBankRuntimeContext } from '../context'

export async function requestSummary(
  context: EasyFinBankRuntimeContext,
  corpNum: string,
  jobId: string,
  tradeTypes?: EasyFinBankTradeType[],
  searchString?: string,
  userId?: string
): Promise<EasyFinBankSummaryApiModel> {
  return request(context, corpNum, `${jobPath(jobId)}/Summary?${filterQuery(tradeTypes, searchString)}`, userId)
}
