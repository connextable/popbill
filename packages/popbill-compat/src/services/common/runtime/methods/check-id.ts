import type * as Spec from '@connextable/popbill-spec'
import { request, required, query } from '../common'
import type { CommonRuntimeContext } from '../context'

export const createCheckID = (context: CommonRuntimeContext) => (id: string) => {
  required(id, '확인할 아이디가 입력되지 않았습니다.')
  return request<Spec.CommonOperationApiResponse>(context, undefined, '/IDCheck?' + query({ ID: id }))
}
