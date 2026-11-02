import type { KakaoMethodArguments, KakaoMethodResults } from '../../types'
import type { KakaoRuntimeContext } from '../context'
import { sendBrand } from '../common'

export async function requestSendBMSCarouselCommerce(
  context: KakaoRuntimeContext,
  ...args: KakaoMethodArguments['sendBMSCarouselCommerce']
): Promise<KakaoMethodResults['sendBMSCarouselCommerce']> {
  return sendBrand(context, 'CarouselCommerce', ...args)
}
