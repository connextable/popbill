import type { KakaoMethodArguments, KakaoMethodResults } from '../../types'
import type { KakaoRuntimeContext } from '../context'
import { sendNotification } from '../common'

export async function requestSendATS_one(
  context: KakaoRuntimeContext,
  ...args: KakaoMethodArguments['sendATS_one']
): Promise<KakaoMethodResults['sendATS_one']> {
  const [
    corpNum,
    template,
    sender,
    content,
    altSubject,
    altContent,
    altType,
    sendAt,
    receiver,
    receiverName,
    userId,
    requestNum,
    btns,
    emphasizeTitle,
  ] = args
  return sendNotification(
    context,
    corpNum,
    template,
    sender,
    content,
    altSubject,
    altContent,
    altType,
    sendAt,
    { rcv: receiver, rcvnm: receiverName, msg: content, altsjt: altSubject, altmsg: altContent },
    userId,
    requestNum,
    btns,
    emphasizeTitle
  )
}
