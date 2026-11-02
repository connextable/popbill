import type { KakaoMethodArguments, KakaoMethodResults } from '../../types'
import type { KakaoRuntimeContext } from '../context'
import { url } from '../common'

export async function requestGetSenderNumberMgtURL(
  context: KakaoRuntimeContext,
  ...args: KakaoMethodArguments['getSenderNumberMgtURL']
): Promise<KakaoMethodResults['getSenderNumberMgtURL']> {
  const [corpNum, userId] = args
  return url(context, corpNum, '/Message/?TG=SENDER', userId)
}
