import type { KakaoMethodArguments, KakaoMethodResults } from '../../types'
import type { KakaoRuntimeContext } from '../context'
import { uploadImage } from '../common'

export async function requestUploadCarouselCommerceImage(
  context: KakaoRuntimeContext,
  ...args: KakaoMethodArguments['uploadCarouselCommerceImage']
): Promise<KakaoMethodResults['uploadCarouselCommerceImage']> {
  const [corpNum, files, userId] = args
  return uploadImage(context, corpNum, 'CarouselCommerce', files, false, true, userId)
}
