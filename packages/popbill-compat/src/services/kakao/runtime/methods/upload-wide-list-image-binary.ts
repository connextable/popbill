import type { KakaoMethodArguments, KakaoMethodResults } from '../../types'
import type { KakaoRuntimeContext } from '../context'
import { uploadImage } from '../common'

export async function requestUploadWideListImageBinary(
  context: KakaoRuntimeContext,
  ...args: KakaoMethodArguments['uploadWideListImageBinary']
): Promise<KakaoMethodResults['uploadWideListImageBinary']> {
  const [corpNum, files, userId] = args
  return uploadImage(context, corpNum, 'WideList', files, true, true, userId)
}
