import type { KakaoMethodArguments, KakaoMethodResults } from '../../types'
import type { KakaoRuntimeContext } from '../context'
import { uploadImage } from '../common'

export async function requestUploadImageBinary(
  context: KakaoRuntimeContext,
  ...args: KakaoMethodArguments['uploadImageBinary']
): Promise<KakaoMethodResults['uploadImageBinary']> {
  const [corpNum, files, userId] = args
  return uploadImage(context, corpNum, 'Default', files, true, false, userId)
}
