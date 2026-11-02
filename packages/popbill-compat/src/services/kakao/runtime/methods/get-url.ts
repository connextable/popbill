import type { KakaoMethodArguments, KakaoMethodResults } from '../../types'
import type { KakaoRuntimeContext } from '../context'
import { url, required } from '../common'

export async function requestGetURL(context: KakaoRuntimeContext, ...args: KakaoMethodArguments['getURL']): Promise<KakaoMethodResults['getURL']> {
  const [corpNum, togo, userId] = args
  required(togo, '접근메뉴가 입력되지 않았습니다.')
  return url(context, corpNum, (togo === 'SENDER' ? '/Message/?TG=' : '/KakaoTalk/?TG=') + encodeURIComponent(togo), userId)
}
