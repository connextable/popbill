import type * as Spec from '@connextable/popbill-spec'
import { request, required } from '../common'
import type { CommonRuntimeContext } from '../context'

export const createGetRefundInfo = (context: CommonRuntimeContext) => (corpNum: string, refundCode: string, userId?: string) => {
  required(refundCode, '환불코드가 입력되지 않았습니다.')
  return request<Spec.CommonRefundHistoryApiModel>(context, corpNum, '/Refund/' + encodeURIComponent(refundCode), userId)
}
