import type { KakaoMethodArguments, KakaoMethodResults } from '../../types'
import type { KakaoRuntimeContext } from '../context'
import { uploadImage } from '../common'

export async function requestUploadCommerceImageBinary(
  context: KakaoRuntimeContext,
  ...args: KakaoMethodArguments['uploadCommerceImageBinary']
): Promise<KakaoMethodResults['uploadCommerceImageBinary']> {
  const [corpNum, files, userId] = args
  return uploadImage(context, corpNum, 'Commerce', files, true, false, userId)
}
