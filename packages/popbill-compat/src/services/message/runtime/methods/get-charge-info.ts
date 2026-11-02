import { request, required } from '../common'
import type { MessageRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestGetChargeInfo(
  context: MessageRuntimeContext,
  corpNum: string,
  messageType: Spec.MessageType,
  userId?: string
): Promise<Spec.MessageChargeInfoApiResponse> {
  required(messageType, '메시지 유형이 입력되지 않았습니다.')
  return request(context, corpNum, '/Message/ChargeInfo?Type=' + encodeURIComponent(messageType), userId)
}
