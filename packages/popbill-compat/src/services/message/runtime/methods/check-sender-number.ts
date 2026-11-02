import { request, required } from '../common'
import type { MessageRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestCheckSenderNumber(
  context: MessageRuntimeContext,
  corpNum: string,
  senderNumber: string,
  userId?: string
): Promise<Spec.MessageApiResponseBase> {
  required(senderNumber, '확인할 발신번호가 입력되지 않았습니다.')
  return request(context, corpNum, '/Message/CheckSenderNumber/' + encodeURIComponent(senderNumber), userId)
}
