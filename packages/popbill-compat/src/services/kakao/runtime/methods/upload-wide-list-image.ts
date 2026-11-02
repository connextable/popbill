import type { KakaoMethodArguments, KakaoMethodResults } from '../../types'
import type { KakaoRuntimeContext } from '../context'
import { uploadImage } from '../common'

export async function requestUploadWideListImage(
  context: KakaoRuntimeContext,
  ...args: KakaoMethodArguments['uploadWideListImage']
): Promise<KakaoMethodResults['uploadWideListImage']> {
  const [corpNum, files, userId] = args
  return uploadImage(context, corpNum, 'WideList', files, false, true, userId)
}
