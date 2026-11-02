import type { KakaoMethodArguments, KakaoMethodResults } from '../../types'
import type { KakaoRuntimeContext } from '../context'
import { request } from '../common'

export async function requestGetSenderNumberList(
  context: KakaoRuntimeContext,
  ...args: KakaoMethodArguments['getSenderNumberList']
): Promise<KakaoMethodResults['getSenderNumberList']> {
  const [corpNum, userId] = args
  return request(context, corpNum, '/Message/SenderNumber', userId)
}
