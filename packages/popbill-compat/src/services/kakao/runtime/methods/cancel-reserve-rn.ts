import type { KakaoMethodArguments, KakaoMethodResults } from '../../types'
import type { KakaoRuntimeContext } from '../context'
import { request, identifier } from '../common'

export async function requestCancelReserveRN(
  context: KakaoRuntimeContext,
  ...args: KakaoMethodArguments['cancelReserveRN']
): Promise<KakaoMethodResults['cancelReserveRN']> {
  const [corpNum, key, userId] = args
  return request(context, corpNum, '/KakaoTalk/Cancel/' + identifier(key, '전송요청번호가 입력되지 않았습니다.'), userId)
}
