import type { KakaoMethodArguments, KakaoMethodResults } from '../../types'
import type { KakaoRuntimeContext } from '../context'
import { sendFriend } from '../common'

export async function requestSendFMS_same(
  context: KakaoRuntimeContext,
  ...args: KakaoMethodArguments['sendFMS_same']
): Promise<KakaoMethodResults['sendFMS_same']> {
  const [corpNum, channel, sender, content, altSubject, altContent, altType, sendAt, ads, imageUrl, filePath, recipients, btns, userId, requestNum] =
    args
  return sendFriend(
    context,
    corpNum,
    channel,
    sender,
    content,
    altSubject,
    altContent,
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
