import type { KakaoMethodArguments, KakaoMethodResults } from '../../types'
import type { KakaoRuntimeContext } from '../context'
import { request } from '../common'

export async function requestListPlusFriendID(
  context: KakaoRuntimeContext,
  ...args: KakaoMethodArguments['listPlusFriendID']
): Promise<KakaoMethodResults['listPlusFriendID']> {
  const [corpNum, userId] = args
  return request(context, corpNum, '/KakaoTalk/ListPlusFriendID', userId)
}
