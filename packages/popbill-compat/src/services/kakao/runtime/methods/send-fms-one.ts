import type { KakaoMethodArguments, KakaoMethodResults } from '../../types'
import type { KakaoRuntimeContext } from '../context'
import { sendFriend } from '../common'

export async function requestSendFMS_one(
  context: KakaoRuntimeContext,
  ...args: KakaoMethodArguments['sendFMS_one']
): Promise<KakaoMethodResults['sendFMS_one']> {
  const [
    corpNum,
    channel,
    sender,
    content,
    altSubject,
    altContent,
    altType,
    sendAt,
    receiver,
    receiverName,
    ads,
    imageUrl,
    filePath,
    btns,
    userId,
    requestNum,
  ] = args
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
    { rcv: receiver, rcvnm: receiverName, msg: content, altsjt: altSubject, altmsg: altContent },
    btns,
    userId,
    requestNum,
    imageUrl,
    filePath
  )
}
