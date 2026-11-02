import type { KakaoMethodArguments, KakaoMethodResults } from '../../types'
import type { KakaoRuntimeContext } from '../context'
import { request, required } from '../common'

export async function requestGetChargeInfo(
  context: KakaoRuntimeContext,
  ...args: KakaoMethodArguments['getChargeInfo']
): Promise<KakaoMethodResults['getChargeInfo']> {
  const [corpNum, type, userId] = args
  required(type, '카카오톡 유형이 입력되지 않았습니다.')
  return request(context, corpNum, '/KakaoTalk/ChargeInfo?Type=' + encodeURIComponent(type), userId)
}
