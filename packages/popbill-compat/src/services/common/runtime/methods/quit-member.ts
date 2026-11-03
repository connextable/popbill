import type * as Spec from '@connextable/popbill-spec'
import { parseSafeInteger } from '@connextable/popbill-utils'
import { request, required } from '../common'
import type { CommonRuntimeContext } from '../context'

export const createQuitMember = (context: CommonRuntimeContext) => async (corpNum: string, reason: string, userId?: string) => {
  required(reason, '탈퇴 사유가 입력되지 않았습니다.')
  const response = await request<Spec.CommonOperationApiResponse>(context, corpNum, '/QuitRequest', userId, 'POST', { quitReason: reason })
  if (parseSafeInteger(response.code) === 1) {
    context.requestClient.invalidateToken?.(corpNum)
    context.tokenProvider.invalidate(corpNum)
  }
  return response
}
