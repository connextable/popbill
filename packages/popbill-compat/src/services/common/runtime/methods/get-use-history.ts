import type * as Spec from '@connextable/popbill-spec'
import { request, query, validateDates } from '../common'
import type { CommonRuntimeContext } from '../context'

export const createGetUseHistory =
  (context: CommonRuntimeContext) =>
  (corpNum: string, startDate: string, endDate: string, page?: number, perPage?: number, order?: string, userId?: string) => {
    validateDates(startDate, endDate)
    return request<Spec.CommonGetUseHistoryApiResponse>(
      context,
      corpNum,
      '/UseHistory?' + query({ SDate: startDate, EDate: endDate, Order: order, Page: page, PerPage: perPage }),
      userId
    )
  }
