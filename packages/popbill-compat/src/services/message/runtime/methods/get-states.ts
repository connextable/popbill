import { createLegacyValidationError } from '@/internal/errors'
import { request } from '../common'
import type { MessageRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestGetStates(
  context: MessageRuntimeContext,
  corpNum: string,
  receiptNumList: string[],
  userId?: string
): Promise<Spec.MessageGetStatesApiResponse> {
  if (!Array.isArray(receiptNumList) || !receiptNumList.length) throw createLegacyValidationError('문자전송 접수번호 배열이 입력되지 않았습니다.')
  return request(context, corpNum, '/Message/States', userId, 'POST', receiptNumList)
}
