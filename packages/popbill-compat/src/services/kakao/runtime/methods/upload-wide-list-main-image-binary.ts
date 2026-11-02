import type { KakaoMethodArguments, KakaoMethodResults } from '../../types'
import type { KakaoRuntimeContext } from '../context'
import { uploadImage } from '../common'

export async function requestUploadWideListMainImageBinary(
  context: KakaoRuntimeContext,
  ...args: KakaoMethodArguments['uploadWideListMainImageBinary']
): Promise<KakaoMethodResults['uploadWideListMainImageBinary']> {
  const [corpNum, files, userId] = args
  return uploadImage(context, corpNum, 'WideList/Main', files, true, false, userId)
}
