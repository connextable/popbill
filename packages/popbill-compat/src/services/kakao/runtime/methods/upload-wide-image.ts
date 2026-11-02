import type { KakaoMethodArguments, KakaoMethodResults } from '../../types'
import type { KakaoRuntimeContext } from '../context'
import { uploadImage } from '../common'

export async function requestUploadWideImage(
  context: KakaoRuntimeContext,
  ...args: KakaoMethodArguments['uploadWideImage']
): Promise<KakaoMethodResults['uploadWideImage']> {
  const [corpNum, files, userId] = args
  return uploadImage(context, corpNum, 'WideImage', files, false, false, userId)
}
