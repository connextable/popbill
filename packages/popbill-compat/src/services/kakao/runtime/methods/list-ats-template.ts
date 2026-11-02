import type { KakaoMethodArguments, KakaoMethodResults } from '../../types'
import type { KakaoRuntimeContext } from '../context'
import { request } from '../common'

export async function requestListATSTemplate(
  context: KakaoRuntimeContext,
  ...args: KakaoMethodArguments['listATSTemplate']
): Promise<KakaoMethodResults['listATSTemplate']> {
  const [corpNum, userId] = args
  return request(context, corpNum, '/KakaoTalk/ListATSTemplate', userId)
}
