import type * as Spec from '@connextable/popbill-spec'
import { request, required } from '../common'
import type { CommonRuntimeContext } from '../context'

export const createQuitMember = (context: CommonRuntimeContext) => async (corpNum: string, reason: string, userId?: string) => {
  required(reason, '탈퇴 사유가 입력되지 않았습니다.')
  const response = await request<Spec.CommonOperationApiResponse>(context, corpNum, '/QuitRequest', userId, 'POST', { quitReason: reason })
  if (response.code === 1) {
    context.requestClient.invalidateToken?.(corpNum)
    context.tokenProvider.invalidate(corpNum)
  }
  return response
}
