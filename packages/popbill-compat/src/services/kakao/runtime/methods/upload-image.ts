import type { KakaoMethodArguments, KakaoMethodResults } from '../../types'
import type { KakaoRuntimeContext } from '../context'
import { uploadImage } from '../common'

export async function requestUploadImage(
  context: KakaoRuntimeContext,
  ...args: KakaoMethodArguments['uploadImage']
): Promise<KakaoMethodResults['uploadImage']> {
  const [corpNum, files, userId] = args
  return uploadImage(context, corpNum, 'Default', files, false, false, userId)
}
