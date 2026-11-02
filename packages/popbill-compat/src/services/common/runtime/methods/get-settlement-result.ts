import type * as Spec from '@connextable/popbill-spec'
import { request, required } from '../common'
import type { CommonRuntimeContext } from '../context'

export const createGetSettleResult = (context: CommonRuntimeContext) => (corpNum: string, settlementCode: string, userId?: string) => {
  required(settlementCode, '정산코드가 입력되지 않았습니다.')
  return request<Spec.CommonPaymentHistoryApiModel>(context, corpNum, '/Payment/' + encodeURIComponent(settlementCode), userId)
}
