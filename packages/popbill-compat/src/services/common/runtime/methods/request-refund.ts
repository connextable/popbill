import type * as Spec from '@connextable/popbill-spec'
import type { CommonRefundForm } from '../../types'
import { request, required } from '../common'
import type { CommonRuntimeContext } from '../context'

export const createRefund = (context: CommonRuntimeContext) => (corpNum: string, form: CommonRefundForm, userId?: string) => {
  required(form, '환불신청 정보가 입력되지 않았습니다.')
  return request<Spec.CommonRequestRefundApiResponse>(context, corpNum, '/Refund', userId, 'POST', form)
}
