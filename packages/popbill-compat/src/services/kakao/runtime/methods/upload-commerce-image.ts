import type { KakaoMethodArguments, KakaoMethodResults } from '../../types'
import type { KakaoRuntimeContext } from '../context'
import { uploadImage } from '../common'

export async function requestUploadCommerceImage(
  context: KakaoRuntimeContext,
  ...args: KakaoMethodArguments['uploadCommerceImage']
): Promise<KakaoMethodResults['uploadCommerceImage']> {
  const [corpNum, files, userId] = args
  return uploadImage(context, corpNum, 'Commerce', files, false, false, userId)
}
