import type { KakaoMethodArguments, KakaoMethodResults } from '../../types'
import type { KakaoRuntimeContext } from '../context'
import { uploadImage } from '../common'

export async function requestUploadCarouselCommerceImageBinary(
  context: KakaoRuntimeContext,
  ...args: KakaoMethodArguments['uploadCarouselCommerceImageBinary']
): Promise<KakaoMethodResults['uploadCarouselCommerceImageBinary']> {
  const [corpNum, files, userId] = args
  return uploadImage(context, corpNum, 'CarouselCommerce', files, true, true, userId)
}
