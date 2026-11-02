import type { KakaoMethodArguments, KakaoMethodResults } from '../../types'
import type { KakaoRuntimeContext } from '../context'
import { url } from '../common'

export async function requestGetBMSTemplateMgtURL(
  context: KakaoRuntimeContext,
  ...args: KakaoMethodArguments['getBMSTemplateMgtURL']
): Promise<KakaoMethodResults['getBMSTemplateMgtURL']> {
  const [corpNum, userId] = args
  return url(context, corpNum, '/KakaoTalk/?TG=BMS_TEMPLATE', userId)
}
