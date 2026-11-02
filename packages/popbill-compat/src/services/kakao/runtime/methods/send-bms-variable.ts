import type { KakaoMethodArguments, KakaoMethodResults } from '../../types'
import type { KakaoRuntimeContext } from '../context'
import { sendBrand } from '../common'

export async function requestSendBMSVariable(
  context: KakaoRuntimeContext,
  ...args: KakaoMethodArguments['sendBMSVariable']
): Promise<KakaoMethodResults['sendBMSVariable']> {
  return sendBrand(context, 'Variable', ...args)
}
