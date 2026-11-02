import { request } from '../common'
import type { MessageRuntimeContext } from '../context'
import type * as Spec from '@connextable/popbill-spec'

export async function requestCheckAutoDenyNumber(
  context: MessageRuntimeContext,
  corpNum: string,
  userId?: string
): Promise<Spec.MessageAutoDenyNumberApiResponse> {
  return request(context, corpNum, '/Message/AutoDenyNumberInfo', userId)
}
