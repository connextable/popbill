import type { KakaoMethodArguments, KakaoMethodResults } from '../../types'
import type { KakaoRuntimeContext } from '../context'
import { sendBrand } from '../common'

export async function requestSendBMSText(
  context: KakaoRuntimeContext,
  ...args: KakaoMethodArguments['sendBMSText']
): Promise<KakaoMethodResults['sendBMSText']> {
  return sendBrand(context, 'Text', ...args)
}
