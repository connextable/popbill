import type { KakaoMethodArguments, KakaoMethodResults } from '../../types'
import type { KakaoRuntimeContext } from '../context'
import { url } from '../common'

export async function requestGetSentListURL(
  context: KakaoRuntimeContext,
  ...args: KakaoMethodArguments['getSentListURL']
): Promise<KakaoMethodResults['getSentListURL']> {
  const [corpNum, userId] = args
  return url(context, corpNum, '/KakaoTalk/?TG=BOX', userId)
}
