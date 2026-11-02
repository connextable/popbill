import type { KakaoMethodArguments, KakaoMethodResults } from '../../types'
import type { KakaoRuntimeContext } from '../context'
import { uploadImage } from '../common'

export async function requestUploadWideListMainImage(
  context: KakaoRuntimeContext,
  ...args: KakaoMethodArguments['uploadWideListMainImage']
): Promise<KakaoMethodResults['uploadWideListMainImage']> {
  const [corpNum, files, userId] = args
  return uploadImage(context, corpNum, 'WideList/Main', files, false, false, userId)
}
