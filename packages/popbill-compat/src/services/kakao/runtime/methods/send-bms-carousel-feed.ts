import type { KakaoMethodArguments, KakaoMethodResults } from '../../types'
import type { KakaoRuntimeContext } from '../context'
import { sendBrand } from '../common'

export async function requestSendBMSCarouselFeed(
  context: KakaoRuntimeContext,
  ...args: KakaoMethodArguments['sendBMSCarouselFeed']
): Promise<KakaoMethodResults['sendBMSCarouselFeed']> {
  return sendBrand(context, 'CarouselFeed', ...args)
}
