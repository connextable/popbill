import type { KakaoMethodArguments, KakaoMethodResults } from '../../types'
import type { KakaoRuntimeContext } from '../context'
import { request, identifier, required } from '../common'

export async function requestGetATSTemplate(
  context: KakaoRuntimeContext,
  ...args: KakaoMethodArguments['getATSTemplate']
): Promise<KakaoMethodResults['getATSTemplate']> {
  const [corpNum, key, userId] = args
  required(key, '템플릿 코드가 입력되지 않았습니다.')
  return request(context, corpNum, '/KakaoTalk/GetATSTemplate/' + identifier(key.trim(), '템플릿 코드가 입력되지 않았습니다.'), userId)
}
