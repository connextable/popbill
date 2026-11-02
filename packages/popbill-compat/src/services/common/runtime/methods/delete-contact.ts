import type * as Spec from '@connextable/popbill-spec'
import { request, required, query } from '../common'
import type { CommonRuntimeContext } from '../context'

export const createDeleteContact = (context: CommonRuntimeContext) => (corpNum: string, targetUserId: string, userId: string) => {
  required(targetUserId, '담당자 아이디가 입력되지 않았습니다.')
  return request<Spec.CommonOperationApiResponse>(context, corpNum, '/Contact/Delete?' + query({ ContactID: targetUserId }), userId, 'POST', '')
}
