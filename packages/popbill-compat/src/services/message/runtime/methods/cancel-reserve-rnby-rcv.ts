import { request, required } from '../common'
import type { MessageRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestCancelReserveRNbyRCV(
  context: MessageRuntimeContext,
  corpNum: string,
  requestNum: string,
  receiveNum: string,
  userId?: string
): Promise<Spec.MessageApiResponseBase> {
  required(requestNum, '문자전송 요청번호가 입력되지 않았습니다.')
  required(receiveNum, '문자전송 수신번호가 입력되지 않았습니다.')
  return request(context, corpNum, '/Message/Cancel/' + encodeURIComponent(requestNum), userId, 'POST', { receiveNum })
}
