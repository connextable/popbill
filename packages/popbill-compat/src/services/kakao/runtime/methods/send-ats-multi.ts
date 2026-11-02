import type { KakaoMethodArguments, KakaoMethodResults } from '../../types'
import type { KakaoRuntimeContext } from '../context'
import { sendNotification } from '../common'

export async function requestSendATS_multi(
  context: KakaoRuntimeContext,
  ...args: KakaoMethodArguments['sendATS_multi']
): Promise<KakaoMethodResults['sendATS_multi']> {
  const [corpNum, template, sender, altType, sendAt, recipients, userId, requestNum, btns] = args
  return sendNotification(context, corpNum, template, sender, undefined, undefined, undefined, altType, sendAt, recipients, userId, requestNum, btns)
}
