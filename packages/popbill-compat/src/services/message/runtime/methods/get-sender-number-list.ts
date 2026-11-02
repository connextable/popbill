import { request } from '../common'
import type { MessageRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestGetSenderNumberList(
  context: MessageRuntimeContext,
  corpNum: string,
  userId?: string
): Promise<Spec.MessageSenderNumberApiModel[]> {
  return request(context, corpNum, '/Message/SenderNumber', userId)
}
