import type { KakaoMethodArguments, KakaoMethodResults } from '../../types'
import type { KakaoRuntimeContext } from '../context'
import { request, identifier } from '../common'

export async function requestGetMessages(
  context: KakaoRuntimeContext,
  ...args: KakaoMethodArguments['getMessages']
): Promise<KakaoMethodResults['getMessages']> {
  const [corpNum, key, userId] = args
  return request(context, corpNum, '/KakaoTalk/' + identifier(key, '접수번호가 입력되지 않았습니다.'), userId)
}
