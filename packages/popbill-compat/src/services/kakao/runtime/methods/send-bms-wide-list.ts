import type { KakaoMethodArguments, KakaoMethodResults } from '../../types'
import type { KakaoRuntimeContext } from '../context'
import { sendBrand } from '../common'

export async function requestSendBMSWideList(
  context: KakaoRuntimeContext,
  ...args: KakaoMethodArguments['sendBMSWideList']
): Promise<KakaoMethodResults['sendBMSWideList']> {
  return sendBrand(context, 'WideList', ...args)
}
