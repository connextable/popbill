import type { KakaoMethodArguments, KakaoMethodResults } from '../../types'
import type { KakaoRuntimeContext } from '../context'
import { sendFriend } from '../common'

export async function requestSendFTS_one(
  context: KakaoRuntimeContext,
  ...args: KakaoMethodArguments['sendFTS_one']
): Promise<KakaoMethodResults['sendFTS_one']> {
  const [corpNum, channel, sender, content, altSubject, altContent, altType, sendAt, receiver, receiverName, ads, btns, userId, requestNum] = args
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
    requestNum
  )
}
