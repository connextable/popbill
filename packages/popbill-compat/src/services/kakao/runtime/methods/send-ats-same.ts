import type { KakaoMethodArguments, KakaoMethodResults } from '../../types'
import type { KakaoRuntimeContext } from '../context'
import { sendNotification } from '../common'

export async function requestSendATS_same(
  context: KakaoRuntimeContext,
  ...args: KakaoMethodArguments['sendATS_same']
): Promise<KakaoMethodResults['sendATS_same']> {
  return sendNotification(context, ...args)
}
