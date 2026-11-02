import type { EasyFinBankSearchResultApiModel, EasyFinBankTradeType } from '@connextable/popbill-spec'
import { filterQuery, jobPath, query, request } from '../common'
import type { EasyFinBankRuntimeContext } from '../context'

export async function requestSearch(
  context: EasyFinBankRuntimeContext,
  corpNum: string,
  jobId: string,
  tradeTypes?: EasyFinBankTradeType[],
  searchString?: string,
  page?: number,
  perPage?: number,
  order?: string,
  userId?: string
): Promise<EasyFinBankSearchResultApiModel> {
  const suffix = query({ Page: page, PerPage: perPage, Order: order })
  return request(context, corpNum, `${jobPath(jobId)}?${filterQuery(tradeTypes, searchString)}${suffix ? '&' + suffix : ''}`, userId)
}
