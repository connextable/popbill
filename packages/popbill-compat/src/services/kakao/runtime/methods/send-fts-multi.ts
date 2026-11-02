import type { KakaoMethodArguments, KakaoMethodResults } from '../../types'
import type { KakaoRuntimeContext } from '../context'
import { sendFriend } from '../common'

export async function requestSendFTS_multi(
  context: KakaoRuntimeContext,
  ...args: KakaoMethodArguments['sendFTS_multi']
): Promise<KakaoMethodResults['sendFTS_multi']> {
  const [corpNum, channel, sender, altType, sendAt, ads, recipients, btns, userId, requestNum] = args
  return sendFriend(context, corpNum, channel, sender, undefined, undefined, undefined, altType, sendAt, ads, recipients, btns, userId, requestNum)
}
