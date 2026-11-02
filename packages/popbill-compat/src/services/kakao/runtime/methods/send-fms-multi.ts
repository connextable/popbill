import type { KakaoMethodArguments, KakaoMethodResults } from '../../types'
import type { KakaoRuntimeContext } from '../context'
import { sendFriend } from '../common'

export async function requestSendFMS_multi(
  context: KakaoRuntimeContext,
  ...args: KakaoMethodArguments['sendFMS_multi']
): Promise<KakaoMethodResults['sendFMS_multi']> {
  const [corpNum, channel, sender, altType, sendAt, ads, imageUrl, filePath, recipients, btns, userId, requestNum] = args
  return sendFriend(
    context,
    corpNum,
    channel,
    sender,
    undefined,
    undefined,
    undefined,
    altType,
    sendAt,
    ads,
    recipients,
    btns,
    userId,
    requestNum,
    imageUrl,
    filePath
  )
}
