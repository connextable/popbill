import type * as Spec from '@connextable/popbill-spec'
import { request, query } from '../common'
import type { CommonRuntimeContext } from '../context'

export const createGetRefundHistory = (context: CommonRuntimeContext) => (corpNum: string, page?: number, perPage?: number, userId?: string) =>
  request<Spec.CommonGetRefundHistoryApiResponse>(context, corpNum, '/RefundHistory?' + query({ Page: page, PerPage: perPage }), userId)
