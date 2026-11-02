import type { KakaoMethodArguments, KakaoMethodResults } from '../../types'
import type { KakaoRuntimeContext } from '../context'
import { sendBrand } from '../common'

export async function requestSendBMSWideImage(
  context: KakaoRuntimeContext,
  ...args: KakaoMethodArguments['sendBMSWideImage']
): Promise<KakaoMethodResults['sendBMSWideImage']> {
  return sendBrand(context, 'WideImage', ...args)
}
