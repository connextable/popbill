import type * as Spec from '@connextable/popbill-spec'
import { request, required } from '../common'
import type { CommonRuntimeContext } from '../context'

export const createJoinMember = (context: CommonRuntimeContext) => (form: Spec.CommonJoinFormApiModel) => {
  required(form, '회원정보가 입력되지 않았습니다.')
  return request<Spec.CommonOperationApiResponse>(context, undefined, '/Join', undefined, 'POST', form)
}
