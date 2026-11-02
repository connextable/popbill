import type * as Spec from '@connextable/popbill-spec'
import { request } from '../common'
import type { CommonRuntimeContext } from '../context'

export const createGetRefundableBalance = (context: CommonRuntimeContext) => (corpNum: string, userId?: string) =>
  request<Spec.CommonRefundableBalanceApiResponse>(context, corpNum, '/RefundPoint', userId)
