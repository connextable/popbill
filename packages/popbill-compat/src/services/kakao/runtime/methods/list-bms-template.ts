import type { KakaoMethodArguments, KakaoMethodResults } from '../../types'
import type { KakaoRuntimeContext } from '../context'
import { request } from '../common'

export async function requestListBMSTemplate(
  context: KakaoRuntimeContext,
  ...args: KakaoMethodArguments['listBMSTemplate']
): Promise<KakaoMethodResults['listBMSTemplate']> {
  const [corpNum, userId] = args
  return request(context, corpNum, '/KakaoTalk/BMSTemplates', userId)
}
