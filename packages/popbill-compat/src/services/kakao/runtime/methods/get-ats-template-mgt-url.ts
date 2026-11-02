import type { KakaoMethodArguments, KakaoMethodResults } from '../../types'
import type { KakaoRuntimeContext } from '../context'
import { url } from '../common'

export async function requestGetATSTemplateMgtURL(
  context: KakaoRuntimeContext,
  ...args: KakaoMethodArguments['getATSTemplateMgtURL']
): Promise<KakaoMethodResults['getATSTemplateMgtURL']> {
  const [corpNum, userId] = args
  return url(context, corpNum, '/KakaoTalk/?TG=TEMPLATE', userId)
}
