import type { KakaoMethodArguments, KakaoMethodResults } from '../../types'
import type { KakaoRuntimeContext } from '../context'
import { request, required, identifier } from '../common'

export async function requestCancelReservebyRCV(
  context: KakaoRuntimeContext,
  ...args: KakaoMethodArguments['cancelReservebyRCV']
): Promise<KakaoMethodResults['cancelReservebyRCV']> {
  const [corpNum, key, receiveNum, userId] = args
  required(receiveNum, '수신번호가 입력되지 않았습니다.')
  return request(context, corpNum, '/KakaoTalk/' + identifier(key, '접수번호가 입력되지 않았습니다.') + '/Cancel', userId, 'POST', { receiveNum })
}
