import type * as Spec from '@connextable/popbill-spec'
import { request, required } from '../common'
import type { CommonRuntimeContext } from '../context'

export const createGetContactInfo = (context: CommonRuntimeContext) => (corpNum: string, contactId: string, userId?: string) => {
  required(contactId, '담당자 아이디가 입력되지 않았습니다.')
  return request<Spec.CommonContactApiModel>(context, corpNum, '/Contact', userId, 'POST', { id: contactId })
}
