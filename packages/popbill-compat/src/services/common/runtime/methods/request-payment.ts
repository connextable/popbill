import type * as Spec from '@connextable/popbill-spec'
import { request, required } from '../common'
import type { CommonRuntimeContext } from '../context'

export const createPaymentRequest = (context: CommonRuntimeContext) => (corpNum: string, form: Spec.CommonPaymentFormApiModel, userId?: string) => {
  required(form, '입금신청 정보가 입력되지 않았습니다.')
  return request<Spec.CommonRequestPaymentApiResponse>(context, corpNum, '/Payment', userId, 'POST', form)
}
