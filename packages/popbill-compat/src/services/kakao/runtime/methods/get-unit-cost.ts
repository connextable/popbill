import type { KakaoMethodArguments, KakaoMethodResults } from '../../types'
import type { KakaoRuntimeContext } from '../context'
import { request, required } from '../common'

export async function requestGetUnitCost(
  context: KakaoRuntimeContext,
  ...args: KakaoMethodArguments['getUnitCost']
): Promise<KakaoMethodResults['getUnitCost']> {
  const [corpNum, type] = args
  required(type, '카카오톡 유형이 입력되지 않았습니다.')
  return (await request<{ unitCost: string }>(context, corpNum, '/KakaoTalk/UnitCost?Type=' + encodeURIComponent(type))).unitCost
}
