import { request } from '../common'
import type { MessageRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestGetAutoDenyList(
  context: MessageRuntimeContext,
  corpNum: string,
  userId?: string
): Promise<Spec.MessageAutoDenyApiModel[]> {
  return request(context, corpNum, '/Message/Denied', userId)
}
