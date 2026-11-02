import type * as Spec from '@connextable/popbill-spec'
import { request, query, validateDates } from '../common'
import type { CommonRuntimeContext } from '../context'

export const createGetPaymentHistory =
  (context: CommonRuntimeContext) => (corpNum: string, startDate: string, endDate: string, page?: number, perPage?: number, userId?: string) => {
    validateDates(startDate, endDate)
    return request<Spec.CommonGetPaymentHistoryApiResponse>(
      context,
      corpNum,
      '/PaymentHistory?' + query({ SDate: startDate, EDate: endDate, Page: page, PerPage: perPage }),
      userId
    )
  }
