import type { KakaoMethodArguments, KakaoMethodResults } from '../../types'
import type { KakaoRuntimeContext } from '../context'
import { sendBrand } from '../common'

export async function requestSendBMSCommerce(
  context: KakaoRuntimeContext,
  ...args: KakaoMethodArguments['sendBMSCommerce']
): Promise<KakaoMethodResults['sendBMSCommerce']> {
  return sendBrand(context, 'Commerce', ...args)
}
