import type { KakaoMethodArguments, KakaoMethodResults } from '../../types'
import type { KakaoRuntimeContext } from '../context'
import { uploadImage } from '../common'

export async function requestUploadCarouselFeedImageBinary(
  context: KakaoRuntimeContext,
  ...args: KakaoMethodArguments['uploadCarouselFeedImageBinary']
): Promise<KakaoMethodResults['uploadCarouselFeedImageBinary']> {
  const [corpNum, files, userId] = args
  return uploadImage(context, corpNum, 'CarouselFeed', files, true, true, userId)
}
