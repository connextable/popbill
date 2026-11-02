import type { KakaoMethodArguments, KakaoMethodResults } from '../../types'
import type { KakaoRuntimeContext } from '../context'
import { sendFriend } from '../common'

export async function requestSendFTS_same(
  context: KakaoRuntimeContext,
  ...args: KakaoMethodArguments['sendFTS_same']
): Promise<KakaoMethodResults['sendFTS_same']> {
  return sendFriend(context, ...args)
}
