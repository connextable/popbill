import type { KakaoMethodArguments, KakaoMethodResults } from '../../types'
import type { KakaoRuntimeContext } from '../context'
import { request, required, identifier } from '../common'

export async function requestCancelReserveRNbyRCV(
  context: KakaoRuntimeContext,
  ...args: KakaoMethodArguments['cancelReserveRNbyRCV']
): Promise<KakaoMethodResults['cancelReserveRNbyRCV']> {
  const [corpNum, key, receiveNum, userId] = args
  required(receiveNum, '수신번호가 입력되지 않았습니다.')
  return request(context, corpNum, '/KakaoTalk/Cancel/' + identifier(key, '전송요청번호가 입력되지 않았습니다.'), userId, 'POST', { receiveNum })
}
