import { request, required } from '../common'
import type { MessageRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestGetMessagesRN(
  context: MessageRuntimeContext,
  corpNum: string,
  requestNum: string,
  userId?: string
): Promise<Spec.MessageSentApiModel[]> {
  required(requestNum, '문자전송 요청번호가 입력되지 않았습니다.')
  return request(context, corpNum, '/Message/Get/' + encodeURIComponent(requestNum), userId)
}
