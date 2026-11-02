import { request, required } from '../common'
import type { MessageRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestGetMessages(
  context: MessageRuntimeContext,
  corpNum: string,
  receiptNum: string,
  userId?: string
): Promise<Spec.MessageSentApiModel[]> {
  required(receiptNum, '문자전송 접수번호가 입력되지 않았습니다.')
  return request(context, corpNum, '/Message/' + encodeURIComponent(receiptNum), userId)
}
