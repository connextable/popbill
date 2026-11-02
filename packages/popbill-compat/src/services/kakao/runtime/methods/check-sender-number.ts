import type { KakaoMethodArguments, KakaoMethodResults } from '../../types'
import type { KakaoRuntimeContext } from '../context'
import { request, identifier } from '../common'

export async function requestCheckSenderNumber(
  context: KakaoRuntimeContext,
  ...args: KakaoMethodArguments['checkSenderNumber']
): Promise<KakaoMethodResults['checkSenderNumber']> {
  const [corpNum, key, userId] = args
  return request(context, corpNum, '/KakaoTalk/CheckSenderNumber/' + identifier(key.trim(), '발신번호가 입력되지 않았습니다.'), userId)
}
