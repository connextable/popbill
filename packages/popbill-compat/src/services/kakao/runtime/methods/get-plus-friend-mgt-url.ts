import type { KakaoMethodArguments, KakaoMethodResults } from '../../types'
import type { KakaoRuntimeContext } from '../context'
import { url } from '../common'

export async function requestGetPlusFriendMgtURL(
  context: KakaoRuntimeContext,
  ...args: KakaoMethodArguments['getPlusFriendMgtURL']
): Promise<KakaoMethodResults['getPlusFriendMgtURL']> {
  const [corpNum, userId] = args
  return url(context, corpNum, '/KakaoTalk/?TG=PLUSFRIEND', userId)
}
