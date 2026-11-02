import type { KakaoMethodArguments, KakaoMethodResults } from '../../types'
import type { KakaoRuntimeContext } from '../context'
import { sendBrand } from '../common'

export async function requestSendBMSImage(
  context: KakaoRuntimeContext,
  ...args: KakaoMethodArguments['sendBMSImage']
): Promise<KakaoMethodResults['sendBMSImage']> {
  return sendBrand(context, 'Image', ...args)
}
