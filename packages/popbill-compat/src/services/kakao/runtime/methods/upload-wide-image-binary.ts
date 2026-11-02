import type { KakaoMethodArguments, KakaoMethodResults } from '../../types'
import type { KakaoRuntimeContext } from '../context'
import { uploadImage } from '../common'

export async function requestUploadWideImageBinary(
  context: KakaoRuntimeContext,
  ...args: KakaoMethodArguments['uploadWideImageBinary']
): Promise<KakaoMethodResults['uploadWideImageBinary']> {
  const [corpNum, files, userId] = args
  return uploadImage(context, corpNum, 'WideImage', files, true, false, userId)
}
