import type { KakaoMethodArguments, KakaoMethodResults } from '../../types'
import type { KakaoRuntimeContext } from '../context'
import { uploadImage } from '../common'

export async function requestUploadCarouselFeedImage(
  context: KakaoRuntimeContext,
  ...args: KakaoMethodArguments['uploadCarouselFeedImage']
): Promise<KakaoMethodResults['uploadCarouselFeedImage']> {
  const [corpNum, files, userId] = args
  return uploadImage(context, corpNum, 'CarouselFeed', files, false, true, userId)
}
